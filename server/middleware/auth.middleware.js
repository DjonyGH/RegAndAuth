const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headres.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Auth error'});
        }
        const decodedToken = jwt.verify(token, config.get('secretKey'));
        req.user = decodedToken;
        next();
    } catch (e) {
        console.log(e);
        res.send({message: 'Server error'})
    }
}