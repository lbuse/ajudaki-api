'use strict'
import express from 'express'
import UserDao from '../dao/UserDao'
import DatabaseHelper from '../helpers/Databasehelper'
import UserService from '../services/UserService'

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const userDao = new UserDao(databaseHelper)
const userService = new UserService(userDao)

router.post(
  '/',
  UserService.validate('signin'),
  userService.signin.bind(userService)
)

export default router
