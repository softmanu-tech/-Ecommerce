const axios = require("axios")

const createToken= async(req,res,next)=>{
    const secret = "SIIvqQVJlmAq2diKWGpG2qyLGJ0eE4tfBDE022LAoQ7sY1BqpnD35P7IcZQFwJ0q"
    const consumer = "syosqVQGYV2AcGxGZBgyBgGGmtxmAJKS1m4hGt3xP4Noiqj9"
    const auth= new Buffer.from(`${consumer}:${secret}`).toString("base64")
    

    await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            headers:{
                authorization: `Basic ${auth}`
            },

        }

    ).then((data) =>{
        token = data.data.access_token; 
        console.log(data.data)
        next();
    }).
    catch((err) =>{
        console.log(err)
        res.status(400).json(err.message)
    })


}

const stkPush = async(req,res)=>{
    const shortCode = 174379
    const phone = req.body.phone.substring(1)
    const amount = req.body.amount
    
    const passkey ="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    const date = new Date()
    const timestamp = 
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2)

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const data={
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: `254${phone}`,
            PartyB: shortCode,
            PhoneNumber: `254${phone}`,
            CallBackURL: "https://mydomain.com",
            AccountReference: `254${phone}`,
            TransactionDesc: 'Payment for goods/services'
          }

          await axios
          .post(
            url,data, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }

          ) 
}


module.exports ={createToken,stkPush}


