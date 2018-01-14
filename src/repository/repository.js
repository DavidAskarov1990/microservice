'use strict';

const repository = function(db) {

    const collection = db.collection('movies');

    const getAllMovies = function () {
        return new Promise(function (resolve, reject) {
            const movies = [];
            const cursor = collection.find({}, {title: 1, id: 1});
            const addMovie = function (movie) {
                movies.push(movie);
            };

            const sendMovies = function (err) {
                if(err) {
                    reject(new Error('An error occured fetching all movies, err:' + err))
                }
                resolve(movies.slice());
            };

            cursor.forEach(addMovie, sendMovies);
        })
    };

    const getMoviePremiers = function () {
        return new Promise(function (resolve, reject) {
            const movies = [];
            const currentDay = new Date();
            const query = {
                releaseYear: {
                    $gt: currentDay.getFullYear() - 1,
                    $lte: currentDay.getFullYear()
                },
                releaseMonth: {
                    $gte: currentDay.getMonth() + 1,
                    $lte: currentDay.getMonth() + 2
                },
                releaseDay: {
                    $lte: currentDay.getDate()
                }
            };
            const cursor = collection.find(query);
            const addMovie = function (movie) {
                movies.push(movie);
            };

            const sendMovies = function (err) {
                if(err) {
                    reject(new Error('An error occured fetching all movies, err:' + err))
                }
                resolve(movies)
            };

            cursor.forEach(addMovie, sendMovies)
        })
    };

    const getMovieById = function (id) {
        return new Promise(function (resolve, reject) {
            const projection = { _id:0, id: id, title: 1, format: 1};
            const sendMovie = function (err, movie) {
                if(err) {
                    reject(new Error('An error occured fetching a movie with id:' +  id ,' err: ' + err))
                }
                resolve(movie);
            };
            collection.findOne({id: id}, projection, sendMovie)
        })
    };

    const disconnect = function () {
        db.close()
    };

    return Object.create({
        getAllMovies: getAllMovies,
        getMoviePremiers: getMoviePremiers,
        getMovieById: getMovieById,
        disconnect: disconnect
    })

};

const connect = function (connetion) {
    return new Promise(function(resolve, reject) {
        if(!connetion){
            reject(new Error('connection db not supplied!'))
        }
        resolve(repository(connetion))
    })
};

module.exports = Object.assign({}, {connect: connect});