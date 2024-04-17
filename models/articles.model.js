const db = require('../db/connection')
const format = require('pg-format')

exports.fetchArticlesWithCommentCount = (topic) => {
    const validQueries = ['cats', 'paper', 'mitch', 'coding', 'football', 'cooking']

    let SQLStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    `
    if (topic && validQueries.includes(topic)) {
        SQLStr += `WHERE articles.topic = '${topic}' `
    } else if (!topic) {
        SQLStr += `WHERE articles.topic IS NOT NULL`
    } else {
        return Promise.reject({status: 404, msg: "404 Error: Resource doesn't exist"})
    }

    SQLStr += `
    GROUP BY articles.article_id 
    ORDER BY created_at DESC;`

    return db.query(SQLStr)
    .then(({rows}) => {
        return rows.length === 0 ? [] : rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows}) => {
        return rows.length === 0 ? Promise.reject({status:404, msg: "404 Error: Resource Doesn't exist"}) : rows
    })
}

exports.updateArticleVotes = (article_id, votes) => {
    const values = [votes, article_id]
    const SQLString = format(
        `UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;`
    )

    return db.query(SQLString, values)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404 Error: Resource doesn't exist"})
        }
        const [updatedArticle] = rows
        return updatedArticle
    })
}
