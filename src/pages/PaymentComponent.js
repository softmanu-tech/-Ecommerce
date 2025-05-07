import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {initializeApp} from 'firebase/app'
import { getMessaging, getToken } from "firebase/messaging";
import {useNavigate} from 'react-router-dom'


const firebaseConfig = {
    apiKey: "AIzaSyDhYtJAIeq9dI4q9sb6T72kyXCKrD2Nur8",
    authDomain: "prosoft-electronic-shop.firebaseapp.com",
    projectId: "prosoft-electronic-shop",
    storageBucket: "prosoft-electronic-shop.appspot.com",
    messagingSenderId: "54971893082",
    appId: "1:54971893082:web:7b4d6b8133747285231f63",
    measurementId: "G-588ZVD5X45"
  };
const app = initializeApp(firebaseConfig);

const PaymentComponent = ({ totalAmount,products }) => {
    const [phone, setPhone] = useState();
    
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);

    

    useEffect(() => {
        const messaging = getMessaging();
        getToken(messaging, { vapidKey: 'BECDe1YMbnBt7TSyRJsiz7w3fZjzb496Zt4McjO175cyQz82koE5rV6lCHLz3mYWyppokiDelnvkgHtiHIcfAEg' }).then((currentToken) => {
            if (currentToken) {
                setFcmToken(currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPaymentStatus(null);

        try {
            const response = await axios.post('http://localhost:8080/token', { phone, amount: totalAmount });
            console.log('Payment initiated:', response.data);
            setPaymentStatus({ type: 'success', message: 'Payment initiated. Please check your phone for the M-Pesa prompt.' });

            await sendThankYouMessage();
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus({ type: 'error', message: 'Payment initiation failed. Please try again.' });
            
        } finally {
            setIsLoading(false);
        }
    };

    const sendThankYouMessage = async () => {
        if(!fcmToken){
            console.error('No FCM token available');
            return;
        }
        try{
            const message = generateThankYouMessage();
            await axios.post('http://localhost:8080/send-message',{
                token: fcmToken,
                title: 'Thank You For Your Purchase',
                body: message

            });
            console.log('Thank you message sent')
        } catch(error){
            console.error('Failed to send the message')
        }
    }

    const generateThankYouMessage = () =>{
        const productList = products ? products.map(p => `${p.name} (${p.quantity})`).join(',') : 'your items';
        return `You bought: ${productList}. Total amount paid: KES ${totalAmount}. We appreciate your business!`;
    }

    return (
        <form onSubmit={handlePayment} className="mt-4">
            <div className="mb-4">
                <label htmlFor="phone" className=" clearfix p-1  font-bold text-center text-2xl  justify-center items  grid grid-cols-2  "> Lipa Na
                    <span  className='text-green-600 font-bold '> 
                        <img src='./mpesa.png'className='w-20 '/>
                    </span>

                </label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=" 0708904996"
                    required
                    className="mt-3 block w-full text-center font-bold rounded-md border-gray-300 text-xl focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-green-600 text-white p-2 font-bold text-2xl rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
            {paymentStatus && (
                <div className={`mt-4 p-2 rounded ${paymentStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {paymentStatus.message}
                </div>
            )}
        </form>
    );
};

export default PaymentComponent;