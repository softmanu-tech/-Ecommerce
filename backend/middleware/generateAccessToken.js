const axios = require("axios")

const getToken = async (req, res, next) =>{
    
        const consumer_key = process.env.MPESA_CONSUMER_KEY;
        const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
        //const auth = process.env.MPESA_AUTH_KEY
        const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
      
        try {
          const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',{
            headers: {
              Authorization: `Basic ${auth}`,
            },
          });

          req.access_token = response.data.access_token;
          
          console.log("Token :", response.data.accessToken);

          next();
        } catch (error) {
          console.log(err);
          res.status(502).json(err.message)
        }
      
}
module.exports = getToken