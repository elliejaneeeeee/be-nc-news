const commentsRouter = require('express').Router()
const { removeCommentById, patchCommentById } = require('../controller/comments.controller')

commentsRouter
.route('/:comment_id')
.delete(removeCommentById)
.patch(patchCommentById)

module.exports = commentsRouter