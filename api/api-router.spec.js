const server = require('../server.js');
const request = require('supertest');
const db = require('../database/dbConfig.js');
const model = require('./api-model.js');
const bcrypt = require('bcryptjs');

beforeEach(async()=> {
    await db('users').truncate();
    await db('jokes').truncate();
    await db('saved').truncate();
})
describe('POST /register',()=> {
    it('should return message w/ token', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        const res = await request(server).post('/api/register').send(body)
        expect(res.body).toEqual({"message": "user created!", token: newToken})
    })
})
describe('POST /login',()=> {
    it('return object with user info', async()=> {
        const body = {username: 'anon2', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)
        const res = await request(server).post('/api/login').send(body)
        expect(res.body).toEqual({"message": "logged in user", "info": {"id":1, "username": "anon2","email": "ex@ex.com", "password": res.body.info.password}, "token": res.body.token})
    })
})

describe('GET /jokes',()=> {
    it('should recieve jokes array', async()=> {
        const res = await request(server).get('/api/jokes')
        expect(res.body).toEqual({"jokes" : []})
    })
})
describe('POST /restricted/jokes',()=> {
    it('should return success message', async()=> {
        const body = {user_id: 1, question: "test", answer: "test", status: "public"}
        const res = await request(server).post("/restricted/jokes").send(body)
        expect(res.body).toEqual({message:'added joke with the following data!', joke: body})
    })
})
// describe('',()=> {
//     test(''), ()=> {

//     }
// })
// describe('',()=> {
//     test(''), ()=> {

//     }
// })