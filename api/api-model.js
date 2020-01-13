const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');

module.exports = {
    genToken,
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
function genToken(user){
    const payload = {
        subject: user.id,
        username: user.username
    }
    const secret = process.env.SECRET || 'secret';
    const options = {
        expiresIn: '2d'
    }
    return jwt.sign(payload, secret, options)
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
    return db('saved').where('user_id', id);
}

function insertSaved(body){
    return db('saved').insert(body)
}

function getUserJokes(id) {
    return db('jokes').where('user_id', id);
}

function insertJoke(body){
    return db('jokes').insert(body);
}

function insertUser(body){
    return db('users').insert(body).then(id =>{
        console.log(id[0])
        const userId = id[0]; 
        return db('users').where("username", body.username).first();
    })
}

function remove(id){
    return db('jokes').where({id}).del();
}

function update(id, changes){
    return db('jokes').where({id}).update(changes);
}