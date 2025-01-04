const express = require('express');
const router = express.Router();
const db = require('./databases/conexion_to_do')
const Users = require('./models/toDo/users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Landing
router.get('/',(request, response)=>{
    response.json({'message': 'This is the landing page for the to-do-list backend'})
})
//Register page
router.post('/register', async (req, res) => {
    try {
        const email = req.body.email || "";
        
        if (!!email){
            Users.findOne({"email": email})
            .then(async result => {
                if (!!!result) {
                    const user = new Users(req.body);                    
                    const salt = await bcrypt.genSalt(parseInt(process.env.HASH_TODO));
                    const password = await bcrypt.hash(req.body.password, salt);
                    user.password = password;
                    user.save()
                    .then(user => res.json({message: true}))
                    .catch(error => res.json(error));
                }
                else {
                    res.json({message: false});
                }
            })
            .catch(error => res.json({error: error}));
        } else {
            res.json({message: false})
        }
    } catch {
        res.json({message: false})
    }
})

router.post('/login', async (req, res) => {
    const user = req.body;
    try {
        Users.findOne({email: user.email})
        .then(result => 
            {if (result != null) {
                const username = result.username;
                bcrypt.compare(user.password, result.password)
                .then(comp => {
                    if (comp) {
                        const token = jwt.sign({
                                id: result._id
                            }, process.env.SECRET_TOKEN_TODO, {expiresIn : "1 year"});
                        res.header('auth-token', token).header('username', username)
                        .json({"message": comp});
                    } else {
                        res.json({"message": comp});
                    }
                })
                .catch(error => res.json({"message": error}))
            } else {
                res.json({"message": false})
            }
        })
        .catch(error => {
            res.json({message: error})
        });
    } catch{
        res.json({"message": "Error in the try"})
    } 
})

router.post('/check-token', async (req, res) => {
    const userToken = req.body.token || "";
    try {
        const verified = jwt.verify(userToken, process.env.SECRET_TOKEN_TODO);
        res.json({validToken: verified.id})
    } catch(err) {
        res.json({validToken: false})
    }
})

module.exports = router;