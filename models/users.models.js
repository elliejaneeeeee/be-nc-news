const db = require('../db/connection')
const format = require('pg-format')

exports.fetchUsers = () => {
    return db.query(`
    SELECT *
    FROM users;`)
    .then(({rows}) => {
        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    const sqlStr = format(`
    SELECT * FROM %I 
    WHERE username = $1;`, 
    'users')

    return db.query(sqlStr, [username])
    .then(({rows}) => {
        const [user] = rows
        return rows.length === 0 ? Promise.reject({status: 404, msg: "404 Error: Resource doesn't exist"}) : user
    })
}