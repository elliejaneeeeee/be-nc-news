const db = require('../db/connection')
const format = require('pg-format')
const {checkExists} = require('../db/seeds/utils')
const { includes } = require('../db/data/test-data/articles')

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

exports.deleteCommentById = (comment_id) => {
    return checkExists('comments', 'comment_id', comment_id)
    .then(() => {
        const sqlStr = format(`
        DELETE FROM comments
        WHERE comment_id = $1;`)
    
        return db.query(sqlStr, [comment_id])
    })
    
}

exports.updateCommentById = (comment_id, inc_votes) => {
    const sqlStr = format(
        `UPDATE %I 
        SET %I = votes + $1 
        WHERE %I = $2 
        RETURNING *;`,
        'comments', 'votes', 'comment_id'
    )

    return db.query(sqlStr, [inc_votes, comment_id])
    .then(({rows}) => {
        const [comment] = rows
        return rows.length === 0 ? Promise.reject({status:404, msg: "404 Error: Resource doesn't exist"}) : comment
    })
}