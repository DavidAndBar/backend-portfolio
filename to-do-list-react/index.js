const express = require('express');
const client = require('./databases/conexion_to_do');
const router = express.Router();
const Users = require('./models/toDo/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const db_collection = client.db('to_do_react').collection('users')

// Landing page
router.get('/',(request, response)=>{
    response.json({'message': 'This is the landing page for the to-do-list backend'})
})

router.post('/register', async (req, res) => {
    const email = req.body.email || "";
    await client.connect()
    if (!!email){
        await db_collection.findOne({"email": email})
        .then(async result => {
            if (result === null) {
                const user = new Users(req.body);
                const salt = await bcrypt.genSalt(parseInt(process.env.HASH_TODO));
                const password = await bcrypt.hash(req.body.password, salt);
                user.password = password
                
                db_collection.insertOne(user)
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
})

router.post('/login', async (req, res) => {
    const user = req.body;
    await client.connect()
    
    db_collection.findOne({email: user.email})
    .then(result => 
        { if (result != null) {
            bcrypt.compare(user.password, result.password)
            .then(comp => {
                if (comp) {
                    const token = jwt.sign({
                            id: result._id
                        }, process.env.SECRET_TOKEN_TODO, {expiresIn : "1 year"});
                    
                    res.header('auth-token', token)
                    .json({"message": comp});
                } else {
                    res.json({"message": comp})
                }
            })
            .catch(error => res.json({"message": error}))
        } else {
            res.json({"message": false})
        }
    })
    .catch(error => res.json({message: error}));

})

module.exports = router;