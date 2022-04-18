'use strict'

class CampaignHelpDoneModel {
  constructor({ id, idCampaign, idMethod, methodDescription, logDonation }) {
    this.id = id
    this.idCampaign = idCampaign
    this.idMethod = idMethod
    this.methodDescription = methodDescription
    this.logDonation = logDonation
  }
}

export default CampaignHelpDoneModel
