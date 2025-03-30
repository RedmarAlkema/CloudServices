const jwt = require('jsonwebtoken');

class AuthMiddleware {
    authenticate(req, res, next) {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied' });
        
        try {
            const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token' });
        }
    }

    authorize(roles = []) {
        return (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        };
    }
}

module.exports = new AuthMiddleware();