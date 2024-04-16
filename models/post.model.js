const db = require('../db/connection')

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
