const topicsRouter = require('express').Router()
const { getTopics } = require('../controller/topics.controller')

topicsRouter.get('/', getTopics)

module.exports = topicsRouter
