'use strict'
import express from 'express'
import CampaignHelpMethodDao from '../../dao/CampaignHelpMethodDao'
import DatabaseHelper from '../../helpers/DatabaseHelper'
import CampaignHelpMethodService from '../../services/CampaignHelpMethodService'
import { TokenHelper } from '../../helpers/SecurityHelper'

const router = express.Router({ mergeParams: true })
const databaseHelper = new DatabaseHelper()
const campaignHelpMethodDao = new CampaignHelpMethodDao(databaseHelper)
const campaignHelpMethodService = new CampaignHelpMethodService(campaignHelpMethodDao)

router.get(
  '/:id',
  TokenHelper.validate(),
  TokenHelper.check,
  campaignHelpMethodService.getById.bind(campaignHelpMethodService)
)

router.get(
  '/',
  TokenHelper.validate(),
  TokenHelper.check,
  campaignHelpMethodService.getAll.bind(campaignHelpMethodService)
)

router.post(
  '/',
  [
    TokenHelper.validate(),
    CampaignHelpMethodService.validate('add')
  ],
  TokenHelper.check,
  campaignHelpMethodService.add.bind(campaignHelpMethodService)
)

router.put(
  '/',
  [
    TokenHelper.validate(),
    CampaignHelpMethodService.validate('update')
  ],
  TokenHelper.check,
  campaignHelpMethodService.update.bind(campaignHelpMethodService)
)

router.delete(
  '/',
  [
    TokenHelper.validate(),
    CampaignHelpMethodService.validate('delete')
  ],
  TokenHelper.check,
  campaignHelpMethodService.remove.bind(campaignHelpMethodService)
)

export default router
