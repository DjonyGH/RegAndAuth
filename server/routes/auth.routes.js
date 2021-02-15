const Router = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = new Router()

router.post('/registration',
    [
        check('login', 'Login must be longer than or equal to 8 characters').isLength({min: 3}),
        check('email', 'Uncorrected email').isEmail(),
        check('pass', 'Password must be longer than or equal to 8 characters').isLength({min: 8}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty) {
                return res.status(400).json({message: 'Uncorrected request'}, errors);
            }

            const {login, email, pass} = await req.body;

            const candidateLogin = await User.findOne({login});
            const candidateEmail = await User.findOne({email});

            if (candidateLogin) {
                if (candidateEmail) {
                    return res.status(400).json({
                        message: `User with login ${login} and ${email} already exist`,
                        codeError: 'loginAndEmailExist'
                    });
                }
                return res.status(400).json({
                    message: `User with login ${login} already exist`,
                    codeError: 'loginExist'
                });
            } else {
                if (candidateEmail) {
                    return res.status(400).json({
                        message: `User with email ${email} already exist`,
                        codeError: 'emailExist'
                    });
                } 
            }            

            const hashPass = await bcrypt.hash(pass, 8);
            
            const user = new User({login, email, pass: hashPass});
            await user.save();

            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"});
            return res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    email: user.email
                },
                message: 'User was created'
            })

        } catch(e) {
            console.log(e);
            res.send({message: 'Server error'});
        }
    }
);

router.get('/check-login', async (req, res) => {
    const login = await req.query.login;

    const candidateLogin = await User.findOne({login});

    if (candidateLogin) {
        return res.status(400).json({
            message: `User with login ${login} already exist`,
            code: 'loginExist'
        });
    } else {
        return res.status(200).json({
            message: `${login} free`,
            code: 'loginFree'
        });
    }
});

router.get('/check-email', async (req, res) => {
    const email = await req.query.email;

    const candidateEmail = await User.findOne({email});

    if (candidateEmail) {
        return res.status(400).json({
            message: `User with email ${email} already exist`,
            code: 'emailExist'
        });
    } else {
        return res.status(200).json({
            message: `${email} free`,
            code: 'emailFree'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const {login, pass} = req.body;
        const user = await User.findOne({login});
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const isPassValid = bcrypt.compareSync(pass, user.pass);
        if (!isPassValid) {
            return res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"});
        return res.json({
            token,
            user: {
                id: user.id,
                login: user.login,
                email: user.email
            }
        })
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
});

module.exports = router;