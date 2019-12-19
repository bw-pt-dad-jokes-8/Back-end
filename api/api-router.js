const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('./api-model');
const restricted = require('../middleware/restricted-middleware');
const jwt = require('jsonwebtoken');

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

router.post('/register', (req,res)=> {
    const body = req.body;
    const hash = bcrypt.hashSync(body.password, 12);
    body.password = hash;
    console.log(body)
    db.insertUser(body).then(user =>  {
        res.status(201).json({message: 'user created!'})
    }).catch(err => res.status(500).json({error: err, message: 'internal server error'}))
});

router.post('/login', (req,res)=> {
    const {username, password} = req.body;
    db.getUser({username}).then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            const token = genToken(user);
            res.status(200).json({message: 'logged in user',info: user, token})
        }else{
            res.status(404).json({message: 'user credentials do not match the records'})
        }
    }).catch(err => res.status(500).json({error: err, message: 'internal server error'}))

})

router.get('/jokes', (req, res) => {
    db.getJokes().then(jokes => {
        res.status(200).json({jokes});
    })
})

router.use(restricted);

router.post('/restricted/jokes', (req,res) => {
    const body = req.body;
    db.insertJoke(body).then(joke=> {
        res.status(201).json({message:'added joke with the following data!', joke: body})
    })
});

router.get('/restricted/jokes/:id', (req,res) => {
    const id = req.params.id;
    db.getUserJokes(id).then(jokes => {
        res.status(200).json(jokes);
    })
});

router.post('/api/restricted/saved', (req, res)=> {
    const body = req.body;
    db.insertSaved(body).then(saved => {
        res.status(201).json({message: 'the joke has been saved!', saved})
    })
})




module.exports = router;