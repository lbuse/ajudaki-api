'use strict'

class CampaignModel {
  constructor({ id, title, description, contact, helpMethods = [] }) {
    this.id = id
    this.title = title
    this.description = description
    this.contact = contact
    this.helpMethods = helpMethods
  }
}

export default CampaignModel
