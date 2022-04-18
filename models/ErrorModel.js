'use strict'

class ErrorModel {
  constructor(message, { code, params, stackTrace }) {
    this.code = code
    this.message = message
    this.params = params
    this.stackTrace = stackTrace
  }
}

class Params {
  constructor(name, message) {
    this.name = name
    this.message = message
  }
}

export default ErrorModel
