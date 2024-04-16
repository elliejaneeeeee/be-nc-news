const express = require('express')
const app = express()
const endpoints = require('./endpoints.json')

const { getTopics, getArticles, getArticleById } = require('./controller/get.controller')

app.get('/api/topics', getTopics)

app.get('/api', (req, res) => {
    res.status(200).send({endpoints})
})

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)



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
    } else {
        next(err)
    }
})

//Internal Server Error
app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})

module.exports = app