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
    const token = genToken(body);
    db.insertUser(body).then(user =>  {
        res.status(201).json({message: 'user created!', token})
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
    }).catch(err=> res.status(500).json({error: err, message: 'internal server error'}))
});

router.get('/restricted/jokes/:id', (req,res) => {
    const id = req.params.id;
    db.getUserJokes(id).then(jokes => {
        res.status(200).json(jokes);
    })
});

router.post('/restricted/saved', (req, res)=> {
    const body = req.body;
    db.insertSaved(body).then(saved => {
        res.status(201).json({message: 'the joke has been saved!', saved})
    }).catch(err=> res.status(500).json({error: err, message: 'internal server error'}))
})

router.get('/restricted/saved/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    db.getSaved(id).then(saves => {
        res.status(200).json(saves);
    }).catch(err=> res.status(500).json({error: err, message: 'internal server error'}))
})

router.delete('/restricted/jokes/:id', (req,res) => {
    const id = req.params.id;
    db.remove(id).then( del => {
        res.status(200).json({message: 'joke has been deleted', del})
    }).catch(err=> res.status(500).json({error: err, message: 'internal server error'}))
})

router.put('/restricted/jokes/:id', (req,res) => {
    const id = req.params.id;
    const body = req.body;
    db.update(id, body).then(joke => {
        res.status(200).json({message: 'the joke has been updated'})
    }).catch(err=> res.status(500).json({error: err, message: 'internal server error'}))
})

module.exports = router;