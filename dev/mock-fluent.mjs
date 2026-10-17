// Stand-in for '@servicenow/sdk/core': instead of generating metadata, each call records its
// definition so the dev harness can read the real Fluent sources as the source of truth.
export const registry = {
    tables: [],
    businessRules: [],
    restApis: [],
    records: [],
    properties: [],
    acls: [],
    roles: [],
}

const column =
    (kind) =>
    (options = {}) => ({ kind, ...options })
export const StringColumn = column('string')
export const IntegerColumn = column('integer')
export const BooleanColumn = column('boolean')
export const ChoiceColumn = column('choice')
export const ReferenceColumn = column('reference')
export const DateTimeColumn = column('datetime')

export const Table = (definition) => (registry.tables.push(definition), definition)
export const BusinessRule = (definition) => (registry.businessRules.push(definition), definition)
export const RestApi = (definition) => (registry.restApis.push(definition), definition)
export const Record = (definition) => (registry.records.push(definition), definition)
export const Property = (definition) => (registry.properties.push(definition), definition)
export const Acl = (definition) => (registry.acls.push(definition), definition)
export const Role = (definition) => (registry.roles.push(definition), definition)
export const ApplicationMenu = (definition) => definition
export const Form = (definition) => definition
export const List = (definition) => definition
export const UiPage = (definition) => definition
export const default_view = 'default'
