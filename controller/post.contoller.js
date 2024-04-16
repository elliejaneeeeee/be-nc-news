const { insertCommentByArticleId } = require('../models/post.model')

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body

    insertCommentByArticleId(article_id, username, body)
    .then((body) => {
        const [comment] = body
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}