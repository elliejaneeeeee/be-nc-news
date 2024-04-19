const { insertCommentByArticleId, fetchCommentsByArticleId, deleteCommentById, updateCommentById } = require('../models/comments.model')


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

exports.removeCommentById = (req, res, next) => {
    const {comment_id} = req.params

    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchCommentById = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body

    updateCommentById(comment_id, inc_votes)
    .then((comment) => {

        console.log({comment})
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}