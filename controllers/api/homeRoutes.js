const router = require('express').Router();
const { json } = require('sequelize');
const { User } = require('../models/index')


router.get('/', (req, res) => {
    User.findAll()
        .then(users => {
            console.log(users)
            res.status(200).render('homepage', { users });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Server Error');
        });
});


module.exports = router;