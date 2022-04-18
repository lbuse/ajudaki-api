'use strict'
import express from 'express'
import HelpDoneDao from '../../dao/HelpDoneDao'
import DatabaseHelper from '../../helpers/Databasehelper'
import HelpDoneService from '../../services/HelpDoneService'
import { TokenHelper } from '../../helpers/SecurityHelper'

const router = express.Router({ mergeParams: true })
const databaseHelper = new DatabaseHelper()
const helpDoneDao = new HelpDoneDao(databaseHelper)
const helpDoneService = new HelpDoneService(helpDoneDao)


router.get(
  '/',
  [
    TokenHelper.validate(),
    HelpDoneService.validate('getAll')
  ],
  TokenHelper.check,
  helpDoneService.getAll.bind(helpDoneService)
)

router.get(
  '/:id',
  [
    TokenHelper.validate(),
    HelpDoneService.validate('getById')
  ],
  TokenHelper.check,
  helpDoneService.getById.bind(helpDoneService)
)

router.post(
  '/',
  [
    TokenHelper.validate(),
    HelpDoneService.validate('add')
  ],
  TokenHelper.check,
  helpDoneService.add.bind(helpDoneService)
)

router.delete(
  '/:id',
  [
    TokenHelper.validate(),
    HelpDoneService.validate('remove')
  ],
  TokenHelper.check,
  helpDoneService.remove.bind(helpDoneService)
)

export default router
