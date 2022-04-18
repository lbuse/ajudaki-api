'use strict'
import { body } from 'express-validator'
import createError from 'http-errors'
import { PasswordHelper, TokenHelper } from '../helpers/SecurityHelper'
import AuthenticationModel from '../models/AuthenticationModel'
import ErrorModel from '../models/ErrorModel'
import UserModel from '../models/UserModel'
import Validators from '../utils/Validators'

class UserService {
  constructor(dao) {
    this.dao = dao
  }

  // Validações repetidas em mais de uma rota
  static inputCommonValidation = {
    email: {
      post: body('email').isEmail().withMessage('Email inválido')
    },
    password: {
      post: body('password').isLength({ min: 3 }).withMessage('Senha deve ter no mínimo 3 caracteres')
    }
  }

  // Rotas com suas validações
  static validate = (method) => {
    switch (method) {
      case 'signup':
        return [
          this.inputCommonValidation.email.post,
          this.inputCommonValidation.password.post,
          body('name').isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
          body('lastName').isLength({ min: 3 }).withMessage('Sobrenome deve ter no mínimo 3 caracteres'),
          body('dateOfBirth').isDate().withMessage('Data de nascimento inválida'),
          body('zipCode').optional().isLength({ min: 8 }).withMessage('CEP inválido'),
          body('city').isLength({ min: 3 }).withMessage('Cidade inválida'),
          body('state').isLength({ min: 2 }).withMessage('Estado inválido')
        ]
      case 'signin':
        return [
          this.inputCommonValidation.email.post,
          this.inputCommonValidation.password.post
        ]
    }
  }

  signup = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let _name = req.body.name
    let _lastName = req.body.lastName
    let _dateOfBirth = req.body.dateOfBirth
    let _zipCode = req.body.zipCode
    let _city = req.body.city
    let _state = req.body.state
    let _email = req.body.email
    let _password = req.body.password

    let data
    try {
      data = await this.dao.findOne(_email)
    } catch (e) {
      return next(createError(new ErrorModel))
    }

    if (Array.isArray(data) && data.length == 0) {
      _password = await PasswordHelper.createHash(_password)

      try {
        data = await this.dao.insertOne(
          new UserModel({
            name: _name,
            lastName: _lastName,
            dateOfBirth: _dateOfBirth,
            zipCode: _zipCode,
            city: _city,
            state: _state,
            email: _email,
            password: _password,
            status: UserModel.Status.ATIVACAO_PENDENTE,
            userType: 4 // Valor da tabela `usuario_tipo` do banco de dados
          })
        )
      } catch (e) {
        return next(createError(new ErrorModel(e.text, { code: e.code })))
      }

      req.accepts('application/json')
      res.status(201).end()
    } else {
      req.accepts('application/json')
      res.status(409).json(new ErrorModel('Email já cadastrado', { code: '409' }))
    }
  }

  signin = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let _email = req.body.email
    let _password = req.body.password

    let data
    try {
      data = await this.dao.findOne(_email)
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    if (Array.isArray(data) && data.length) {
      data = data[0]

      if (await PasswordHelper.isPasswordCorrect(_password, data.senha)) {
        let { token, expiresIn } = TokenHelper.createJWT({
          id: data.id,
          name: data.nome,
          email: data.email,
          level: data.nivel,
          tokenPrivateKey: req.app.locals.tokenPrivateKey
        })

        req.accepts('application/json')
        res.status(200).json(new AuthenticationModel(token, expiresIn))
        return
      }
    }

    req.accepts('application/json')
    res
      .status(401)
      .json(new ErrorModel('Usuário ou senha inválidos', { code: '401' }))
  }
}

export default UserService
