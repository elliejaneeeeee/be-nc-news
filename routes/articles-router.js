const articlesRouter = require('express').Router()
const { getArticles, getArticleById, updateArticleById } = require('../controller/articles.controller')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controller/comments.controller')

articlesRouter
.route('/')
.get(getArticles)

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(updateArticleById)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentByArticleId)

module.exports = articlesRouter