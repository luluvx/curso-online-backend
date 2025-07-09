module.exports = app => {
    let router = require('express').Router();
    const controlador = require('@modules/auth/auth.controller');


    router.post('/login', controlador.login);
    router.post('/logout', controlador.logout);
    router.post('/register', controlador.register);

    app.use('/api/auth', router);
};
