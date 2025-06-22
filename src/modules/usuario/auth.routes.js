module.exports = app => {
    let router = require('express').Router();
    const controlador = require('@modules/usuario/auth.controller');

    router.post('/login', controlador.login);
    router.post('/register', controlador.register);

    app.use('/api/auth', router);
};
