const express = require('express')
const app = express()
const endpoints = require('./endpoints.json')

const { getTopics } = require('./controller/topics.controller')
const { getAllUsers } = require('./controller/users.controller')
const { getArticles, getArticleById, updateArticleById } = require('./controller/articles.controller')
const { getCommentsByArticleId, postCommentByArticleId, removeCommentById } = require('./controller/comments.controller')

app.use(express.json())

app.get('/api', (req, res) => {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/users', getAllUsers)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', updateArticleById)

app.delete('/api/comments/:comment_id', removeCommentById)



//Invalid route handling
app.all('*', (req, res) => {
    res.status(404).send({msg: '404 Error: Path not found'})
})

//Custom error handling
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

//PSQL error handling
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: '400 Bad Request: Invalid Id'})
    } else if (err.code === '23502') {
        res.status(400).send({msg: '400 Bad Request: missing/malformed fields'})
    } else if (err.code === '23503') {
        res.status(404).send({msg: "404 Error: Resource doesn't exist"})
    } else if (err.code === '42601') {
        res.status(400).send({ msg: "400 Error: Invalid query" })
    }
    else {
        next(err)
    }
})

//Internal Server Error
app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})

module.exports = app