const Router = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

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
                return res.status(400).json({message: `User with login ${login} already exist`});
            }

            if (candidateEmail) {
                return res.status(400).json({message: `User with login ${email} already exist`});
            }

            const hashPass = await bcrypt.hash(pass, 15);
            
            const user = new User({login, email, pass: hashPass});
            await user.save();
            return res.json({message: 'User was created'});

        } catch(e) {
            console.log(e);
            res.send({message: 'Server error'});
        }
    }
);

module.exports = router;