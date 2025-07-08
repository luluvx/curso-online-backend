require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'curso_online',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432
    },
    production: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'curso_online',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    }
};
