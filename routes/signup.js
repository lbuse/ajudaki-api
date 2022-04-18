'use strict'
import express from "express"
import Databasehelper from "../helpers/Databasehelper"
import UserDao from "../dao/UserDao"
import UserService from "../services/UserService"

const router = express.Router()
const databaseHelper = new Databasehelper()
const userDao = new UserDao(databaseHelper)
const userService = new UserService(userDao)

router.post(
  '/',
  UserService.validate('signup'),
  userService.signup.bind(userService)
)

export default router
