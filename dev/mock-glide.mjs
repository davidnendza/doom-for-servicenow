// A small in-memory emulation of the Glide server APIs the Doom code uses (GlideRecord, GlideDateTime, gs).
// It is only as faithful as it needs to be to exercise src/server/doom/*: it is NOT a ServiceNow instance.
import { randomBytes } from 'node:crypto'

export const db = {
    rows: new Map(), // table -> Map(sys_id -> row)
    schema: new Map(), // table -> table definition from the Fluent source
    businessRules: [],
    properties: new Map(),
    preferences: new Map(),
    counters: new Map(),
    messages: [],
}
const context = { userId: '' }

export const setUser = (id) => (context.userId = id)
export const tableRows = (table) => {
    if (!db.rows.has(table)) db.rows.set(table, new Map())
    return db.rows.get(table)
}
export const newId = () => randomBytes(16).toString('hex')

export function resetData() {
    db.rows.clear()
    db.preferences.clear()
    db.counters.clear()
    db.messages.length = 0
}

const pad = (n) => String(n).padStart(2, '0')
const fmt = (d) =>
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`

export class GlideDateTime {
    constructor(value) {
        if (value === undefined) this._ms = Date.now() + (GlideDateTime.offsetMs ?? 0)
        else this._ms = Date.parse(String(value).replace(' ', 'T') + 'Z')
    }
    getValue() {
        return fmt(new Date(this._ms))
    }
    getNumericValue() {
        return this._ms
    }
}

export const gs = {
    getUserID: () => context.userId,
    getProperty: (name, fallback) => (db.properties.has(name) ? String(db.properties.get(name)) : fallback),
    getUser: () => ({
        getPreference: (name) => db.preferences.get(`${context.userId}:${name}`) ?? null,
        savePreference: (name, value) => db.preferences.set(`${context.userId}:${name}`, String(value)),
    }),
    addErrorMessage: (message) => db.messages.push(message),
    error: (message) => console.error('[gs.error]', message),
    info: () => undefined,
    warn: () => undefined,
}

const isNumeric = (v) => v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))
function compare(actual, op, expected) {
    const a = actual === undefined || actual === null ? '' : String(actual)
    const e = String(expected)
    switch (op) {
        case '=':
            return a === e
        case '!=':
            return a !== e
        case '>':
            return Number(a) > Number(e)
        case '>=':
            return Number(a) >= Number(e)
        case '<':
            return Number(a) < Number(e)
        case '<=':
            return Number(a) <= Number(e)
        default:
            throw new Error(`mock GlideRecord: unsupported operator ${op}`)
    }
}

// Static defaults apply on insert; `javascript:` defaults (auto-numbers) only when the script called newRecord().
function applyDefaults(table, row, withScripted = false) {
    const def = db.schema.get(table)
    if (!def) return
    for (const [name, column] of Object.entries(def.schema)) {
        if (row[name] !== undefined && row[name] !== '') continue
        let value = column.default
        if (typeof value === 'string' && value.startsWith('javascript:')) {
            if (!withScripted) continue
            if (!value.startsWith('javascript:global.getNextObjNumberPadded')) throw new Error(`mock GlideRecord: unsupported default ${value}`)
            const auto = def.autoNumber
            const next = (db.counters.get(table) ?? auto.number) + 1
            db.counters.set(table, next)
            value = `${auto.prefix}${String(next).padStart(auto.numberOfDigits, '0')}`
        }
        row[name] = value === undefined ? '' : String(value)
    }
}

function violatesUniqueIndex(table, row) {
    const def = db.schema.get(table)
    for (const index of def?.index ?? []) {
        if (!index.unique) continue
        const fields = [].concat(index.element)
        for (const other of tableRows(table).values()) {
            if (other !== row && fields.every((f) => other[f] === row[f])) return true
        }
    }
    for (const [name, column] of Object.entries(def?.schema ?? {})) {
        if (!column.unique) continue
        for (const other of tableRows(table).values()) {
            if (other !== row && other[name] === row[name]) return true
        }
    }
    return false
}

function conditionHolds(condition, current, previous) {
    const match = /^(\w+)CHANGESTO(.+)$/.exec(condition)
    if (!match) throw new Error(`mock GlideRecord: unsupported filterCondition ${condition}`)
    const [, field, value] = match
    return (previous[field] ?? '') !== (current[field] ?? '') && current[field] === value
}

function fireRules(table, when, action, current, previous) {
    const rules = db.businessRules
        .filter((br) => br.table === table && br.when === when && br.action.includes(action) && br.active !== false)
        .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
    for (const br of rules) {
        if (br.filterCondition && !conditionHolds(br.filterCondition, current._row, previous._row)) continue
        br.script(current, previous)
    }
}

export class GlideRecord {
    constructor(table) {
        this._table = table
        this._row = null
        this._snapshot = {}
        this._conditions = []
        this._order = []
        this._limit = 0
        this._results = []
        this._cursor = -1
        this._abort = false
    }

    initialize() {
        this._row = {}
        this._snapshot = {}
    }
    newRecord() {
        this.initialize()
        applyDefaults(this._table, this._row, true)
    }
    getValue(field) {
        const v = this._row?.[field]
        return v === undefined || v === '' ? null : v
    }
    setValue(field, value) {
        this._row[field] = value === null || value === undefined ? '' : String(value)
    }
    getUniqueValue() {
        return this._row?.sys_id ?? ''
    }
    getTableName() {
        return this._table
    }
    isValidRecord() {
        return !!this._row
    }
    setAbortAction(flag) {
        this._abort = flag
    }

    addQuery(field, opOrValue, value) {
        if (value === undefined) this._conditions.push([field, '=', opOrValue])
        else this._conditions.push([field, opOrValue, value])
    }
    orderBy(field) {
        this._order.push([field, 1])
    }
    orderByDesc(field) {
        this._order.push([field, -1])
    }
    setLimit(n) {
        this._limit = n
    }

    query() {
        let rows = [...tableRows(this._table).values()].filter((row) =>
            this._conditions.every(([field, op, expected]) => compare(row[field], op, expected))
        )
        for (const [field, dir] of [...this._order].reverse()) {
            rows = rows.sort((a, b) => {
                const x = a[field] ?? ''
                const y = b[field] ?? ''
                return dir * (isNumeric(x) && isNumeric(y) ? Number(x) - Number(y) : String(x).localeCompare(String(y)))
            })
        }
        this._results = this._limit > 0 ? rows.slice(0, this._limit) : rows
        this._cursor = -1
    }
    next() {
        this._cursor += 1
        if (this._cursor >= this._results.length) return false
        this._row = this._results[this._cursor]
        this._snapshot = { ...this._row }
        return true
    }
    get(idOrField, value) {
        const rows = tableRows(this._table)
        const found =
            value === undefined
                ? rows.get(idOrField)
                : [...rows.values()].find((row) => row[idOrField] === String(value))
        if (!found) return false
        this._row = found
        this._snapshot = { ...found }
        return true
    }

    insert() {
        this._abort = false
        applyDefaults(this._table, this._row)
        const previous = new GlideRecord(this._table)
        previous._row = {}
        fireRules(this._table, 'before', 'insert', this, previous)
        if (this._abort) return null
        if (violatesUniqueIndex(this._table, this._row)) return null
        this._row.sys_id ||= newId()
        tableRows(this._table).set(this._row.sys_id, this._row)
        this._snapshot = { ...this._row }
        fireRules(this._table, 'after', 'insert', this, previous)
        return this._row.sys_id
    }

    update() {
        this._abort = false
        const previous = new GlideRecord(this._table)
        previous._row = { ...this._snapshot }
        fireRules(this._table, 'before', 'update', this, previous)
        if (this._abort) {
            Object.assign(this._row, this._snapshot) // an aborted update leaves the stored row untouched
            return null
        }
        this._snapshot = { ...this._row }
        fireRules(this._table, 'after', 'update', this, previous)
        return this._row.sys_id
    }
}
