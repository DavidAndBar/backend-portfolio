const express = require('express');
const router = express.Router();
const db = require('./databases/conexion_to_do')
const Users = require('./models/toDo/users');
require('dotenv').config()

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
        const username = req.body.username || "";
        const newUser = {...req.body,
            lists: [
                {
                    id: "list1",
                    list: [
                        {
                        "id": 1,
                        "name": "Task 1",
                        "completed": false,
                        "dueDate": "2024-12-01"
                        }],
                    title: "List 1"
                }
            ]
        };
        if (!!email){
            Users.findOne({"email": email})
            .then(result => {
                if (!!!result) {
                    Users.findOne({"username": username})
                    .then( async userfound => {
                        if (!!!userfound) {
                            const user = new Users(newUser);
                            const salt = await bcrypt.genSalt(parseInt(process.env.HASH_TODO));
                            const password = await bcrypt.hash(req.body.password, salt);
                            user.password = password;
                            user.save()
                            .then(user => res.json({message: true}))
                            .catch(error => res.json(error));
                        }
                        else {
                            res.json({message: false, failed: "username"});        
                        }
                    })
                }
                else {
                    res.json({message: false, failed: "email"});
                }
            })
            .catch(error => res.json({error: error}));
        } else {
            res.json({message: false, failed: "email"})
        }
    } catch {
        res.json({message: false, failed: "database"})
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

router.get('/:username', (req, res) => {
    const username = req.params.username;
    try {
        Users.findOne({username: username}).
        then(result => {
            res.json({lists: result.lists})
        })
        .catch(error => res.json({message: error}))
    } catch {
        res.json(error => res.json({message: error}))
    }
})

router.put('/:username/:listId', (req, res) => {
    const username = req.params.username;
    const id = req.params.listId;
    
    try {
        Users.findOne({username: username}).
        then(result => {
            const newList = req.body;
            const oldList = result.lists.filter( (item) => item.id == id);
            const updatedLists = result.lists;
            updatedLists[result.lists.indexOf(oldList[0])] = newList;
            

            Users.updateOne({username: username}, {lists: updatedLists}).then(
                upd => console.log(`${username}'s lists updated!`)
            )
            res.json({lists: result.lists})
        })
        .catch(error => res.json({message: error}))
    } catch {
        res.json({message: false})
    }
})

//Create new list
router.post('/:username', (req, res) => {
    const username = req.params.username;
    const newList = req.body;
    
    try {

        Users.findOne({username: username})
        .then(result => {
            const oldLists = result.lists           
            oldLists.push(newList)
            Users.updateOne({username: username}, {lists: oldLists}).then(
                upd => console.log(`${newList.title} list added to ${username}!`)
            )
            res.json({message: true})
        })
        .catch(error => res.json({message: error}));
        
    } catch {
        res.json({message: false})
    }
});

module.exports = router;