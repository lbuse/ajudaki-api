'use strict'

class UserModel {
  constructor({
    id,
    name,
    lastName,
    dateOfBirth,
    zipCode,
    city,
    state,
    email,
    password,
    status = null,
    userType,
    photo = null,
    photoDocument = null
  }) {
    this.id = id
    this.name = name
    this.lastName = lastName
    this.dateOfBirth = dateOfBirth
    this.zipCode = zipCode
    this.city = city
    this.state = state
    this.email = email
    this.password = password
    this.status = status
    this.userType = userType
    this.photo = photo
    this.photoDocument = photoDocument
  }

  static Status = {
    ATIVACAO_PENDENTE: 'ATIVACAO_PENDENTE',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED'
  }
}

export default UserModel
