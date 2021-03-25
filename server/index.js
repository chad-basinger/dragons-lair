require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const authCtrl = require('./controllers/authController')

app.use(express.json())

const {PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post('/auth/register', authCtrl.register)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
.then(dbInstance => {
    app.set('db', dbInstance)
    console.log('db connection successful AF')
    app.listen(PORT, () => console.log(`Server is riding port ${PORT}`))
})
.catch(err => console.log(err))


