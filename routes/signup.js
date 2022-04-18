'use strict'
import express from "express"
import DatabaseHelper from "../helpers/DatabaseHelper"
import UserDao from "../dao/UserDao"
import UserService from "../services/UserService"

const router = express.Router()
const databaseHelper = new DatabaseHelper()
const userDao = new UserDao(databaseHelper)
const userService = new UserService(userDao)

router.post(
  '/',
  UserService.validate('signup'),
  userService.signup.bind(userService)
)

export default router
