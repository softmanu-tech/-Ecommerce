const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mpesaController =require('./mpesaController')

console.log('mpesaController:', mpesaController);
console.log('initiateSTKPush:', mpesaController.initiateSTKPush);
console.log('getOAuthToken:', mpesaController.getOAuthToken);
const bodyParser = require('body-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const axios = require('axios')

const {
    initiateSTKPush,
    getOAuthToken
} = require('./mpesaController')

const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true 
}))
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());

app.post('/api/mpesa/stkpush', initiateSTKPush)
app.get('/api/mpesa/ouath', getOAuthToken)


//ACCESS TOKEN ROUTE
app.get('/accessToken', (req, res)=>{
    getAccessToken()
    .then((accessToken) =>{
        res.send("Your access Token is " + accessToken)
    })
    .catch(console.log)
})

app.post('/api/mpesa/stkpush', (req, res) => {
    if (typeof initiateSTKPush === 'function') {
      initiateSTKPush(req, res);
    } else {
      console.error('initiateSTKPush is not a function');
      res.status(500).json({ error: 'Internal server error' });
    }
  });




app.post('/api/mpesa/stkpush', initiateSTKPush)



app.get("/", getOAuthToken);


const mpesaRouter = express.Router();

mpesaRouter.post('/stkpush', initiateSTKPush);
mpesaRouter.get('/oauth', getOAuthToken);

mpesaRouter.post('/callback', (req, res) => {
  console.log('M-Pesa Callback Data:', req.body);
  res.json({ success: true });

})

if(typeof mpesaController.initiateSTKPush === 'function'){
    app.post('/api/mpesa/stkpush',mpesaController.initiateSTKPush)
} else {
    console.error('initiateSTKPush is not a function')

}

if(typeof mpesaController.getOAuthToken === 'function'){
    app.get('/api/mpesa/oauth', mpesaController.getOAuthToken)
} else {
    console.error('getOAuthToken is not a function')
}
app.use('/api/mpesa', mpesaRouter)
app.use("/api",router)

app.get("/", (req, res) =>{
    res.send("Welcome To The API")
})


const PORT = process.env.PORT || 8080

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Connected to DB")
        console.log("Server is running")
        
    })

})


app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(500).send('Something broke')
})
