const { User, Message , Like} = require('../models/models.js')//import the Like model
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const router = Router()

//home page that finds all the messages
router.get('/', async function (req, res){

    let messages = await Message.findAll({include: User })// find all the messages that belong to the user
let lik = await Likes.findAll({include: Message})// find all the Likes thta belong to each message

    let data = { messages, lik } // place all the likes and messages into data so that they could be rendered on the line below..

    res.render('index.ejs', data)
})


//create Users//////////////////////////////CREATE USER////////////////////////////
router.get('/createUser', async function(req, res){
    res.render('createUser.ejs')//load create user page
})

router.post('/createUser', async function(req, res){
    let { username, password } = req.body

    try {
        await User.create({// retrieve the data stored in the request body create a database table in sql
            username,
            password,
            role: "user"
        })  
    } catch (e) {
        console.log(e)
    }

    res.redirect('/login')
})


//login   ///////////////////////////////////////////lOGIN//////////////////////////
router.get('/login', function(req, res) {
    res.render('login')
})

router.post('/login', async function(req, res) {
    let {username, password} = req.body

let user = undefined;//initially set user to undefined so that it wont pass in the if statement below if there is no user
    try {
         user = await User.findOne({
            where: {username}
        })
    } catch (e) {
        console.log(e)
    }

    if (user && user.password === password) {
        let data = {
            username: username,
            role: user.role
        }

        let token = jwt.sign(data, "theSecret")
        res.cookie("token", token)
        res.redirect('/')
    } else {
        res.redirect('/error')
    }
})



//messages//////////////////////////////////MESSAGES/////////////////////////////////
router.get('/message', async function (req, res) {
    let token = req.cookies.token  // so there is no Verifying who the user is, it just checks if a token is present

    if (token) {                                      // very bad, no verify, don't do this
        res.render('message')
    } else {
        res.render('login')
    }
})


let m_count =0;//set message count to initially 0
let l_count = 0;//set like counts to initially 0

router.post('/message', async function(req, res){
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")  //this verifies/checks who the user is 
 
        let user = await User.findOne({//if such a user exists
            where: {username: payload.username}
        })

        let msg = await Message.create({
            content,
            userId: user.id,
            messageID:m_count// this is the unique counter, it will be unique because it will increment everytime a new message has been creted on m_count++ below
        })


        let c = await Like.create({
            messageID=m_count,
            L_counts = l_count
        })

        m_count++ // increment counter

        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})



/////////////////////
router.post('/like', async function(req,res) {

    // /having difficulty assigning and retrieving message ID to each like button
 
let use=undefined;
    try {
    use = await Like.findOne({// find a message which has the unique messageID
       where: {messageID:message.messageID}
   })
} catch (e) {
   console.log(e)
}

     if(use) {
        let l2_count = message.L_count
        l2_count++ // increment the like counter
         let ll = await Like.create({
                messageID: messageID,// i dont know the method to replace an exisitng data in sul through javascript so im just gona .create() a new table with the same messageID
                L_counts:l_count// store the like counter
            })    
     }  
  

    //  let dat = {
    //     messageID: messageID,
    //     L_counts:l_count
    // }

// let token2 = jwt.sign(dat, "theSecondSecret")
// res.cookie("token2", token)


    res.redirect('/')
})



router.get('/error', function(req, res){
    res.render('error')
})

router.all('*', function(req, res){
    res.send('404 dude')
})

module.exports = router