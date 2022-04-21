'use strict'
import { body, checkSchema } from 'express-validator'
import createError from 'http-errors'
import CampaignModel from '../models/CampaignModel'
import ErrorModel from '../models/ErrorModel'
import Validators from '../utils/Validators'

class CampaignService {
  constructor(dao) {
    this.dao = dao
  }

  static validate = (method) => {
    switch (method) {
      case 'getAll':
        return []
      case 'getById':
      case 'getByUserId':
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
          body('title').isLength({ min: 3 }).withMessage('Título deve ter no mínimo 3 caracteres'),
          body('description').isLength({ min: 3 }).withMessage('Descrição deve ter no mínimo 3 caracteres'),
          body('contact').isLength({ min: 3 }).withMessage('Contato deve ter no mínimo 3 caracteres'),
          // TODO: add validação de objeto
        ]
      case 'update':
        return [
          body('title').isLength({ min: 3 }).withMessage('Título deve ter no mínimo 3 caracteres'),
          body('description').isLength({ min: 3 }).withMessage('Descrição deve ter no mínimo 3 caracteres'),
          body('contact').isLength({ min: 3 }).withMessage('Contato deve ter no mínimo 3 caracteres'),
          // TODO: add validação de objeto
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

    let searchText = req.query.q || ''
    let helpMethods = req.query.filters && Array.isArray(req.query.filters)
      ? req.query.filters
      : []

    let data = []
    try {
      data = await this.dao.findAll({
        searchText: searchText,
        filters: helpMethods
      })
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
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

  getByUserId = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let id = req.params.id

    let data
    try {
      data = await this.dao.findByUser(id)
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


    let userId = req.decoded.id
    let _title = req.body.title
    let _description = req.body.description
    let _contact = req.body.contact
    let _helpMethods = req.body.helpMethods

    let data
    try {
      data = await this.dao.insertOne(
        userId,
        new CampaignModel({
          title: _title,
          description: _description,
          contact: _contact,
          helpMethods: _helpMethods
        })
      )
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(201).json({ id: data, message: 'Campanha criada com sucesso' })
  }

  update = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let _id = req.params.id
    let _title = req.body.title
    let _description = req.body.description
    let _contact = req.body.contact
    let _helpMethods = req.body.helpMethods

    let data
    try {
      data = await this.dao.updateOne(
        new CampaignModel({
          id: _id,
          title: _title,
          description: _description,
          contact: _contact,
          helpMethods: _helpMethods
        })
      )
    } catch (e) {
      return next(createError(new ErrorModel(e.text, { code: e.code })))
    }

    req.accepts('application/json')
    res.status(200).json({ id: data, message: 'Campanha atualizada com sucesso' })
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

export default CampaignService
