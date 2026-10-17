export class ServiceError {
    status = 500
    message = ''
    detail = ''
    setStatus(code) {
        this.status = code
        return this
    }
    setMessage(message) {
        this.message = message
        return this
    }
    setDetail(detail) {
        this.detail = detail
        return this
    }
}
