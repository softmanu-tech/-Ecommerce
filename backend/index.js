const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const TokenRoute = require("./routes/index")


const bodyParser = require('body-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const axios = require('axios')
//const twilio = require('twilio');

const admin = require('firebase-admin');



const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true 
}))
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());



// Initialize Firebase Admin SDK
const serviceAccount = require('./config/prosoft-electronic-shop-firebase-adminsdk-84bon-0757e9e028.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken = process.env.TWILIO_AUTH_TOKEN;
//const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


app.post('/send-message', async (req, res) => {
    const { token, title, body, data } = req.body;
  
    const message = {
      notification: {
        title,
        body
      },
      data: data || {},
      token: token
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log('Message sent successfully:', response);
      res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, message: 'Failed to send message' });
    }
  });















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


app.use("/token",TokenRoute)