const {fetchUsers} = require('../models/users.models')

exports.getAllUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    })
}