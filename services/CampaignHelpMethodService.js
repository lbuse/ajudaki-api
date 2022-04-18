'use strict'
import { body, checkSchema } from 'express-validator'
import CampaignHelpMethodModel from '../models/CampaignHelpMethodModel'
import ErrorModel from '../models/ErrorModel'
import Validators from '../utils/Validators'

class CampaignHelpMethodService {
  constructor(dao) {
    this.dao = dao
  }

  static validate = (method) => {
    switch (method) {
      case 'getById':
        return [
          checkSchema({
            id: {
              in: ['params', 'query'],
              optional: false,
              isNumeric: { options: { min: 1, max: Number.MAX_VALUE } },
              trim: true
            }
          })
        ]
      case 'add':
        return [
          body('description').isLength({ min: 1 }).withMessage('Descrição deve ter no mínimo 1 caracteres'),
        ]
      case 'update':
        return [
          body('id').isNumeric({ min: 1, max: Number.MAX_VALUE }).withMessage('ID inválido'),
          body('description').isLength({ min: 1 }).withMessage('Descrição deve ter no mínimo 1 caracteres'),
        ]
      case 'delete':
        return [
          checkSchema({
            id: {
              in: ['params', 'query'],
              optional: false,
              isNumeric: { options: { min: 1, max: Number.MAX_VALUE } },
              trim: true
            }
          })
        ]
    }
  }

  getAll = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let data = []
    try {
      data = await this.dao.findAll()
    } catch (e) {
      next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(200).json(data)
  }

  getById = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.params.id

    let data
    try {
      data = await this.dao.findOne(id)
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    if (data !== null && data !== undefined) {
      res.status(200).json(data)
    } else {
      res
        .status(400)
        .json(new ErrorModel('Nenhum registro encontrado', { code: 400 }))
    }
  }

  add = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let description = req.body.description

    let data
    try {
      data = await this.dao.insertOne(
        new CampaignHelpMethodModel(
          0,
          description
        )
      )
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(201).json(data)
  }

  update = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.body.id
    let description = req.body.description

    let data
    try {
      data = await this.dao.updateOne(
        new CampaignHelpMethodModel(
          id,
          description
        )
      )
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(201).json(data)
  }

  remove = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.params.id

    try {
      await this.dao.deleteOne(id)
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(204).end()
  }
}

export default CampaignHelpMethodService
