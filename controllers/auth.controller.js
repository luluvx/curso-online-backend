const authService = require('../services/auth.service');



exports.login = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Por favor, complete todos los campos requeridos.' });
    }
    const { email, password } = req.body;
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        const {token, usuario} = await authService.login(email, password);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });

        res.status(200).json({
            message: 'Login exitoso',
            usuario: usuario
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }

}

exports.register = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Por favor, complete todos los campos requeridos.' });
    }
    const { username, nombre, apellido, email, password } = req.body;

    if ( !username || !nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    try {
        const result = await authService.register(username, nombre, apellido, email, password);
        res.status(201).json({ message: result.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
