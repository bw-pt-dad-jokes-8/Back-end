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
afterAll(async()=>{
    await db.destroy();
})
describe('POST /api/register',()=> {
    it('should return message w/ token', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const res = await request(server).post('/api/register').send(body);
        expect(res.body).toEqual({"message": "user created!", token: res.body.token})
    })
})
describe('POST /api/login',()=> {
    it('return object with user info', async()=> {
        const body = {username: 'anon2', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        await request(server).post('/api/register').send(body)
        const res = await request(server).post('/api/login').send(body)
        expect(res.body).toEqual({"message": "logged in user", "info": {"id":1, "username": "anon2","email": "ex@ex.com", "password": res.body.info.password}, "token": res.body.token})
    })
})

describe('GET /api/jokes',()=> {
    it('should recieve jokes array', async()=> {
        const res = await request(server).get('/api/jokes')
        expect(res.body).toEqual({"jokes" : []})
    })
})
describe('POST /api/restricted/jokes',()=> {
    it('should return success message', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)
        const body1 = {user_id: 1, question: "testing question", answer: "testing answer", status: "public"}
        const res = await request(server).post("/api/restricted/jokes").send(body1).set('token', newToken)
        expect(res.body).toEqual({message:'added joke with the following data!', joke: {user_id: 1, question: "testing question", answer: "testing answer", status: "public"}})
    })
})
describe('GET /api/restricted/jokes/:id',()=> {
    it('should return the users jokes', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)
        const res = await request(server).get('/api/restricted/jokes/1').set('token', newToken)
        expect(res.body).toEqual([])
    })
})
describe('POST /api/restricted/saved',()=> {
    it('should return success', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)

        const poster = {username: 'anon2', password: 'example2', email: 'ex2@ex2.com'}
        const posterHash = bcrypt.hashSync(poster.password, 12);
        poster.password = posterHash;
        const posterToken = model.genToken(body);
        await request(server).post('/api/register').send(poster)
        const joke = {user_id: 2, question: "testing question", answer: "testing answer", status: "public"}
        await request(server).post("/api/restricted/jokes").send(joke).set('token', posterToken)

        const saved = {user_id: 1, posted_user_id: 2, joke_id: 1}
        const res = await request(server).post('/api/restricted/saved').send(saved).set('token', newToken)
        expect(res.body).toEqual({"message": "the joke has been saved!", "saved": [1]})
    })
})
describe('GET /api/restricted/saved/jokes',()=> {
    it('should return a list of saved jokes', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)

        const poster = {username: 'anon2', password: 'example2', email: 'ex2@ex2.com'}
        const posterHash = bcrypt.hashSync(poster.password, 12);
        poster.password = posterHash;
        const posterToken = model.genToken(body);
        await request(server).post('/api/register').send(poster)
        const joke = {user_id: 2, question: "testing question", answer: "testing answer", status: "public"}
        await request(server).post("/api/restricted/jokes").send(joke).set('token', posterToken)

        const saved = {user_id: 1, posted_user_id: 2, joke_id: 1}
        await request(server).post('/api/restricted/saved').send(saved).set('token', newToken)
        const res = await request(server).get('/api/restricted/saved/1').set('token', newToken)
        expect(res.body).toEqual([{id: 1, user_id: 1, posted_user_id: 2, joke_id: 1}])
    })
})
describe('DELETE /api/restricted/jokes/:id',()=> {
    it('should return success message', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)
        const body1 = {user_id: 1, question: "testing question", answer: "testing answer", status: "public"}
        await request(server).post("/api/restricted/jokes").send(body1).set('token', newToken)
        const res = await request(server).delete('/api/restricted/jokes/1').set('token', newToken);
        expect(res.body).toEqual({"del": 1, "message": "joke has been deleted"});
    })
})
describe('PUT /api/restricted/jokes/:id',()=> {
    it('should return success message', async()=> {
        const body = {username: 'anon1', password: 'example', email: 'ex@ex.com'}
        const hash = bcrypt.hashSync(body.password, 12);
        body.password = hash;
        const newToken = model.genToken(body);
        await request(server).post('/api/register').send(body)
        const body1 = {user_id: 1, question: "testing question", answer: "testing answer", status: "public"}
        await request(server).post("/api/restricted/jokes").send(body1).set('token', newToken)
        const update = {user_id: 1, question: "testing question updated", answer: "testing answer", status: "public"}
        const res = await request(server).put('/api/restricted/jokes/1').send(update).set('token', newToken)
        expect(res.body).toEqual({"message": "the joke has been updated"})
    })
})