'use strict'
import { body, checkSchema } from 'express-validator'
import createError from 'http-errors'
import CampaignHelpDoneModel from '../models/CampaignHelpDoneModel'
import ErrorModel from '../models/ErrorModel'
import Validators from '../utils/Validators'

class HelpDoneService {
  constructor(dao) {
    this.dao = dao
  }

  static validate = (method) => {
    switch (method) {
      case 'getAll':
        return [
          checkSchema({
            id: {
              in: ['params'],
              optional: false,
              isNumeric: { options: { min: 1, max: Number.MAX_VALUE } },
              trim: true
            }
          })
        ]
      case 'getById':
        return checkSchema({
          id: {
            in: ['params', 'query'],
            optional: false,
            isNumeric: { options: { min: 1, max: Number.MAX_VALUE } },
            trim: true
          }
        })
      case 'add':
        return [
          body('campaignId').isNumeric({ min: 1, max: Number.MAX_VALUE }).withMessage('ID inválido'),
          body('methodId').isNumeric({ min: 1, max: Number.MAX_VALUE }).withMessage('ID inválido'),
          body('logDonation').isLength({ min: 3 }).withMessage('Log deve ter no mínimo 3 caracteres'),
        ]
      case 'remove':
        return checkSchema({
          id: {
            in: ['params', 'query'],
            optional: false,
            isNumeric: { options: { min: 1, max: Number.MAX_VALUE } },
            trim: true
          }
        })
    }
  }

  getAll = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let campaignId = req.params.id

    let data = []
    try {
      data = await this.dao.findAll(campaignId)
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(200).json(data)
  }

  getById = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.params.id || req.query.id

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

    let campaignId = req.body.campaignId
    let methodId = req.body.methodId
    let logDonation = req.body.logDonation

    let data
    try {
      data = await this.dao.insertOne(
        new CampaignHelpDoneModel({
          idCampaign: campaignId,
          idMethod: methodId,
          logDonation: logDonation
        })
      )
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    if (data !== null && data !== undefined) {
      res.status(200).json({ id: data, message: 'Ajuda registra com sucesso' })
    } else {
      res
        .status(400)
        .json(new ErrorModel('Não foi possível finalizar a ajuda', { code: 400 }))
    }
  }

  remove = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.params.id || req.query.id

    let result
    try {
      result = await this.dao.deleteOne(id)
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    if (result.affectedRows > 0) {
      res.status(204).end()
    } else {
      res
        .status(400)
        .json(new ErrorModel(
          'Ocorreu problema ao tentar remover o registro ou ele não existe mais',
          { code: 400 }
        ))
    }
  }
}

export default HelpDoneService
