'use strict'
import express from 'express'
import CampaignDao from '../../dao/CampaignDao'
import DatabaseHelper from '../../helpers/DatabaseHelper'
import { TokenHelper } from '../../helpers/SecurityHelper'
import CampaignService from '../../services/CampaignService'
import help from './help'
import helpMethod from './helpMethod'

const router = express.Router({ mergeParams: true })
const databaseHelper = new DatabaseHelper()

const campaignDao = new CampaignDao(databaseHelper)
const campaignService = new CampaignService(campaignDao)

router.use('/:id([0-9]+)/help', help)
router.use('/help/methods', helpMethod)

router.get(
  '/',
  CampaignService.validate('getAll'),
  campaignService.getAll.bind(campaignService)
)

router.get(
  '/:id',
  CampaignService.validate('getById'),
  campaignService.getById.bind(campaignService)
)

router.get(
  '/u/:id',
  CampaignService.validate('getByUserId'),
  campaignService.getByUserId.bind(campaignService)
)

router.post(
  '/',
  [
    TokenHelper.validate(),
    CampaignService.validate('add')
  ],
  TokenHelper.check,
  campaignService.add.bind(campaignService)
)

router.put(
  '/:id',
  [
    TokenHelper.validate(),
    CampaignService.validate('update')
  ],
  TokenHelper.check,
  campaignService.update.bind(campaignService)
)

router.delete(
  '/:id',
  [
    TokenHelper.validate(),
    CampaignService.validate('remove')
  ],
  TokenHelper.check,
  campaignService.remove.bind(campaignService)
)

export default router
