// src/components/PaymentComponent.js

import React, { useState } from 'react';
import axios from 'axios';

const PaymentComponent = ({ totalAmount }) => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState(totalAmount || '');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPaymentStatus(null);

        try {
            const response = await axios.post('/api/mpesa/stkpush', { phone, amount });
            console.log('Payment initiated:', response.data);
            setPaymentStatus({ type: 'success', message: 'Payment initiated successfully. Please check your phone for the M-Pesa prompt.' });
            // You might want to handle the successful initiation here (e.g., show a message to the user)
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus({ type: 'error', message: 'Payment initiation failed. Please try again.' });
            // Handle errors (e.g., show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">M-Pesa Payment</h2>
            <form onSubmit={handlePayment}>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., 0712345678"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (KSH)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
            </form>
            {paymentStatus && (
                <div className={`mt-4 p-2 rounded ${paymentStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {paymentStatus.message}
                </div>
            )}
        </div>
    );
};

export default PaymentComponent;