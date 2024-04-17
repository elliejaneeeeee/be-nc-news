const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE comments.article_id=$1
    ORDER BY created_at ASC`, [article_id])
    .then(({rows}) => {
        return rows.length === 0 ? Promise.reject({status:404, msg: "404 Error: Resource doesn't exist"}) : rows
    })
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    const created_at = new Date()

    return db.query(`
    INSERT INTO comments
    (body, author, article_id, created_at)
    VALUES
    ($1, $2, $3, $4)
    RETURNING author, body;`, [body, username, article_id, created_at] )
    .then(({rows}) => {
        const [comment] = rows
        return comment
    })
}
