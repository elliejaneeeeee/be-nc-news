const { insertCommentByArticleId, fetchCommentsByArticleId, fetchCommentById } = require('../models/comments.model')


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params

    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body

    insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params

    fetchCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        //console.log(err)
        next(err)
    })
}