const MongoClient = require('mongodb');

const getMongoURL = function (options) {
    const url = options.servers
        .reduce(function (prev, cur) {
            return prev + cur + ',', 'mongodb://';
        })
};

const connect = function (options, mediator) {
    mediator.once('boot.ready', function () {
        MongoClient.connect(
            getMongoURL(options), {
                db: options.dbParameters(),
                server: options.serverParameters(),
                replset: options.replsetParameters(options.repl)
            }, function (err, db) {
                if(err) {
                    mediator.emit('db.error', err)
                }

                db.admin().authenticate(options.user, options.pass, function (err, result) {
                    if(err){
                        mediator.emit('db.error', err)
                    }
                    mediator.emit('db.ready', db)
                })
            }
        )
    })
};

module.exports = Object.assign({}, {connect: connect});