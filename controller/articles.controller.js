const {fetchArticles, fetchArticleById, updateArticleVotes} = require('../models/articles.model')


exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params

    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.updateArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    
    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}
