const authService = require('./authService');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const newUser = await authService.registerUser(username, email, password);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await authService.loginUser(email, password);
            res.json({ token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();