const usersRouter = require('express').Router()
const { getAllUsers } = require('../controller/users.controller')

usersRouter.get('/', getAllUsers)

module.exports = usersRouter