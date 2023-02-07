const express = require("express");

const router = express.Router();
const usersControllers = require("../controllers/users-controllers")
const { check } = require("express-validator")


router.get('/', usersControllers.getUser)

router.post('/signup',
    [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty().isLength({ min: 5 }),
    ],
    usersControllers.signup)
router.post('/login', usersControllers.login)


module.exports = router;
