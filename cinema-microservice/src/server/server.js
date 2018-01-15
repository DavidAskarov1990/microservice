const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const api = require('../api/api');

const start = function (options) {
    return new Promise(function (resolve, reject) {
        if(!options.repo){
            reject(new Error('The server must be started with a connected repository'))
        }
        if(!options.port) {
            reject(new Error('The server must be started with an available port'))
        }

        const app = express();
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(function (err, req, res, next) {
            reject(new Error('Something went wrong!, err:' + err));
            res.status(500).send('Something went wrong!');
        });

        api(app, options);

        app.listen(options.port, function (res) {
            return resolve(res);
        })
    })
};

module.exports = Object.assign({}, {start: start});