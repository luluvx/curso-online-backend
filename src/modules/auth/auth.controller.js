const authService = require('@modules/auth/auth.service');
const rolService = require('@modules/rol/rol.service');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { token, usuario } = await authService.login(email, password);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });

        res.status(200).json({
            message: 'Login exitoso'
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({
            message: 'Logout exitoso'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error durante el logout' });
    }
};

exports.register = async (req, res) => {
    const { username, nombre, apellido, email, password, rolId } = req.body;

    try {
        const rol = await rolService.findById(rolId);
        if (!rol) {
            return res.status(400).json({ error: 'Rol no encontrado' });
        }

        const result = await authService.register(
            username,
            nombre,
            apellido,
            email,
            password,
            rol.id
        );
        res.status(201).json({ message: result.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
