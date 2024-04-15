const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows}) => {
        return rows.length === 0 ? Promise.reject({status:400, msg: "404 Error: Resource Doesn't exist"}) : rows
    })
}