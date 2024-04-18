const commentsRouter = require('express').Router()
const { removeCommentById } = require('../controller/comments.controller')

commentsRouter
.route('/:comment_id')
.delete(removeCommentById)

module.exports = commentsRouter