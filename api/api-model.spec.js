const api = require('./api-model.js');
const db = require('../database/dbConfig.js');

const testUser = {id: 1, username: 'anon1', password: 'example1', email: 'ex1@ex1.com'};
const testUser2 = {id: 2, username: 'anon2', password: 'example2', email: 'ex2@ex2.com'};
const testJoke = {id: 1, user_id: 2, question: "testing question", answer: "testing answer", status: "public"};
const testSaved = {user_id: 1, posted_user_id: 2, joke_id: 1}
const SavedArray = [{id: 1, user_id: 1, posted_user_id: 2, joke_id: 1}]

beforeEach( async() => {
    await db('users').truncate();
    await db('jokes').truncate();
    await db('saved').truncate();
    await api.insertUser({username: 'anon1', password: 'example1', email: 'ex1@ex1.com'})
    await api.insertUser({username: 'anon2', password: 'example2', email: 'ex2@ex2.com'})
    await api.insertJoke({user_id: 2, question: "testing question", answer: "testing answer", status: "public"})
    await api.insertSaved({user_id: 1, posted_user_id: 2, joke_id: 1});
})
afterAll(async()=>{
    await db.destroy();
})
describe('getJokes', ()=> { 
    it('should return list of jokes', async()=> {
        const res = await api.getJokes();
        expect(res).toMatchObject([testJoke]);
    })
})
describe('getUser', ()=> {
    it('should return first user eith matching credentials', async()=> {
        const res = await api.getUser({username: testUser.username});
        expect(res).toEqual(testUser)
    })
})
describe('getJokeById', ()=> {
    it('should get the joke by the id', async()=> {
        const res = await api.getJokeById(1);
        expect(res).toEqual(testJoke);
    })
})
describe('getSaved', ()=> {
    it('should get users saved jokes', async()=> {
        const res = await api.getSaved(1);
        expect(res).toMatchObject(SavedArray)
    })
})
describe('getUserJokes', ()=> {
    it('should retrieve a users jokes', async()=> {
        const res = await api.getUserJokes(2);
        expect(res).toEqual([testJoke])
    })
})
describe('insertJoke', ()=> {
    it('should insert the joke', async()=> {
        await db('jokes').truncate();
        const res = await api.insertJoke(testJoke);
        expect(res).toEqual([1])
    })
})
describe('insertUser', ()=> {
    it('should insert the user', async()=> {
        await db('users').truncate();
        const res = await api.insertUser(testUser);
        expect(res).toEqual([1]);
    })
})
describe('remove', ()=> {
    it('should remove user', async()=> {
        const res = await api.remove(1);
        expect(res).toBe(1);
    })
})
describe('update', ()=> {
    it('should update joke', async()=> {
        const res = await api.update(1, {id: 1, user_id: 2, question: "testing question updated", answer: "testing answer", status: "public"});
        expect(res).toEqual(1)
    })
})