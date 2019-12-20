const db = require('../database/dbConfig');

module.exports = {
    getUser,
    getJokes,
    getJokeById,
    getSaved,
    insertSaved,
    getUserJokes,
    insertJoke,
    insertUser,
    remove,
    update
}
function getUser(filter){
    return db('users').where(filter).first();
}

function getJokes(){
    return db('jokes')
}

function getJokeById(id){
    return db('jokes').where({id}).first();
}

function getSaved(id){
    return db('saved').where({id}).first();
}

function insertSaved(body){
    return db('saved').insert(body).then(id=> getSaved(id[0]))
}

function getUserJokes(id) {
    return db('jokes').where('user_id', id);
}

function insertJoke(body){
    return db('jokes').insert(body).then(id => getJokeById(id[0]))
}

function insertUser(body){
    return db('users').insert(body).then(id => getJokeById(id[0]))
}

function remove(id){
    return db('jokes').where({id}).del();
}

function update(id, changes){
    return db('jokes').where({id}).update(changes);
}