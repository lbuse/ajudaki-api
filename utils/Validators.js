'use strict'
import { validationResult } from 'express-validator'

class Validators {
  static emailPattern = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  static usernamePattern = RegExp(/^[\w]{4,10}$/)
  static passwordPattern = RegExp(/^([\w\W]{6,50})$/)
  static hostnamePattern = RegExp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/)

  static isValidEmail = email => this.emailPattern.test(email)

  static isValidUsername = username => this.usernamePattern.test(username)

  static isValidPassword = password => this.passwordPattern.test(password)

  static isValidHostname = hostname => this.hostnamePattern.test(hostname)

  // Checa se string está vazia, nula ou indefinida
  static isEmpty = str => (!str || 0 === str.length)

  // Checa se string está em branco, nula ou indefinida
  static isBlank = str => (!str || /^\s*$/.test(str))

  static isFloat = (value) => !!(value % 1)

  /**
   * Retorna erro formatado do Express-validator
   */
  static haltOnValidationErrors = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() })
      return true
    }
  }
}

export default Validators
