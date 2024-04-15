const express = require('express')
const app = express()

const { getTopics } = require('./controller/get.controller')

app.get('/api/topics', getTopics)


//Invalid route handling
app.all('*', (req, res) => {
    res.status(404).send({msg: '404 Error: Path not found'})
})


//Internal Server Error
app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})

module.exports = app