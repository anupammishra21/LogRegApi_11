const express = require('express')
const app = express()
require('dotenv').config()
_=require('underscore')
const path = require('path')
const bodyParser= require('body-parser')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')

app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(expressSession({
    secret: "MYS3CR3TK3Y",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true

}))

app.use(cookieParser())

const jwt = require('./middleware/auth')
app.use(jwt.authJwt)

const logRegRouter = require('./routes/logReg.routes')
app.use('/api',logRegRouter)

require(path.join(__dirname,'./config/database'))()

app.listen(process.env.PORT,()=>{
    console.log(`server listen at @http://127.0.0.1:${process.env.PORT}`);
})
