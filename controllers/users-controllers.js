const HttpError = require("../models/http-error");
const { v4: uuid } = require('uuid');
const { validationResult } = require("express-validator")


const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        image:
            'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        places: 3
    }
];
const getUser = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
}
const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError("Invalid Inputs Passed,Please check your data", 422)
    }
    
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email)

    if (hasUser) {
        throw new HttpError("Could not create new user as user already seems to exist , Try logging in", 422)
    }
    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };
    DUMMY_USERS.push(createdUser);
    res.status(201).json({ user: createdUser })
}
const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email)
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("Could not identify user , Creddentials seems to be wrong", 401)
    }
    res.json({ message: "Logged In!" })
}

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;
