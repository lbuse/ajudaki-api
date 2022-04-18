'use strict'
import bcrypt from 'bcryptjs'
import { checkSchema } from 'express-validator'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import ErrorModel from '../models/ErrorModel'
import Validators from '../utils/Validators'

export class TokenHelper {
  /**
   * Executa validações dos campos especificados
   */
  static validate() {
    return checkSchema({
      authorization: {
        in: ['headers', 'body'],
        trim: true,
        customSanitizer: {
          options: (value, { location }) => {
            return location === 'headers' && value && value.startsWith('Bearer ')
              ? value.split(' ')[1]
              : value
          }
        },
        isJWT: true,
        errorMessage: 'Token não informado ou inválido'
      }
    })
  }

  /**
   * Checa Token na rota para liberar ou não o acesso ao
   * método
   */
  static check(req, res, next) {
    if (Validators.haltOnValidationErrors(req, res)) { return }

    let _token = req.headers.authorization

    // Remove Bearer from string
    if (_token && _token.startsWith('Bearer ')) {
      _token = _token.split(' ')[1]
    }

    jwt.verify(_token, req.app.locals.tokenPrivateKey,
      (err, decoded) => {
        if (err) {
          res.status(401).json(new ErrorModel('Token inválido', { code: '401' }))
        } else {
          req.decoded = decoded
          next()
        }
      })
  }

  /**
   * Cria um novo token com informações do usuário que
   * executou o login com sucesso
   *
   * @param {string} name Nome do usuário
   * @param {string} username Usuário
   * @param {string} email Email do usuário
   * @param {integer} level Nível de permissão do usuário
   * @param {string} tokenPrivateKey Chave privada de geração do token (opcional)
   *
   * @retutns Retorna o token gerado
   */
  static createJWT({ id, name, email, level, tokenPrivateKey }) {
    let expiresIn = moment().add(30, 'days')
    return {
      token: jwt.sign(
        {
          id: id,
          name: name,
          email: email,
          level: level
        },
        tokenPrivateKey || process.env.API_TOKEN_PRIVATE_KEY,
        {
          expiresIn: expiresIn.valueOf()
        }
      ),
      expiresIn
    }
  }
}

export class PasswordHelper {
  /**
   * Criptografa senha com bcrypt
   *
   * @param {string} password Senha que será criptografada
   * @returns Retorna senha criptografada
   */
  static createHash(password) {
    return bcrypt.hash(
      password,
      parseInt(process.env.API_PASSWORD_HASH_SALT_ROUNDS)
    )
  }

  /**
   * Verifica se [password] é igual ao obtido no banco de dados
   *
   * @param {string} password Senha preenchida pelo usuário
   * @param {string} passwordHashed Senha criptografada armazenada no banco de dados
   *
   * @returns Retorna verdadeiro quando são iguais
   */
  static isPasswordCorrect(password, passwordHashed) {
    return bcrypt.compare(password, passwordHashed)
  }
}
