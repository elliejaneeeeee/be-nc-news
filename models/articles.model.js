const db = require('../db/connection')

exports.fetchArticles = () => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    CAST(COUNT(comment_id) AS INT) AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id 
    ORDER BY created_at DESC;
    `)
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows}) => {
        return rows.length === 0 ? Promise.reject({status:404, msg: "404 Error: Resource Doesn't exist"}) : rows
    })
}

