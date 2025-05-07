import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayKshCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import PaymentComponent from './PaymentComponent'


const Cart = () => {
    const [data, setData] = useState([])
    const context = useContext(Context)

    const fetchData = async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
            })

            const responseData = await response.json()

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
        }
    }

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            })

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && (
                    <p className='bg-white py-5'>No Data</p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                <div className='w-full max-w-3xl'>
                    {data.map((product, index) => (
                        <div key={product?._id + "Cart"} className='w-full bg-white h-32 my-2 border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                            <div className='w-32 h-32 bg-slate-200'>
                                <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={product?.productId?.productName} />
                            </div>
                            <div className='py-2 px-4 relative'>
                                <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                    <MdDelete />
                                </div>
                                <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                <p className='capitalize text-slate-300'>{product?.productId?.category}</p>
                                <div className='flex items-center justify-between'>
                                    <p className='text-red-600 font-medium text-lg'>{displayKshCurrency(product?.productId?.sellingPrice)}</p>
                                    <p className='text-slate-600 font-semibold text-lg'>{displayKshCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                </div>
                                <div className='flex items-center gap-3 mt-1'>
                                    <button className='flex justify-center items-center hover:bg-red-600 hover:text-white border border-red-600 text-red-600 w-6 h-6 rounded' onClick={() => decreaseQty(product?._id, product?.quantity)}>-</button>
                                    <span>{product?.quantity}</span>
                                    <button className='flex justify-center items-center hover:bg-red-600 hover:text-white border border-red-600 text-red-600 w-6 h-6 rounded' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    <div className='h-36 bg-white'>
                        <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-slate-600'>
                            <p>Quantity</p>
                            <p>{totalQty}</p>
                        </div>
                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-slate-600'>
                            <p>Total Price</p>
                            <p>{displayKshCurrency(totalPrice)}</p>
                        </div>
                        {/**<button className='bg-blue-800 p-2 text-white w-full mt-4'><PaymentComponent totalAmout={totalPrice} />Payment</button>*/}

                        {!showPaymentForm ? (
                            <button 
                                className='bg-slate-200 text-white-800 font-bold text-lg w-full p-2 mt-4 rounded hover:bg-blue-700 hover:text-white'
                                onClick={() => setShowPaymentForm(true)}
                            >
                                Proceed to Payment
                            </button>
                        ) : (
                            <PaymentComponent totalAmount={totalPrice} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart




{/** *
Uncaught runtime errors:
×
ERROR
Failed to fetch
TypeError: Failed to fetch
    at fetchUserAddToCart (http://localhost:3000/static/js/bundle.js:111:32)
    at http://localhost:3000/static/js/bundle.js:121:5
    at commitHookEffectListMount (http://localhost:3000/static/js/bundle.js:42758:30)
    at commitPassiveMountOnFiber (http://localhost:3000/static/js/bundle.js:44251:17)
    at commitPassiveMountEffects_complete (http://localhost:3000/static/js/bundle.js:44223:13)
    at commitPassiveMountEffects_begin (http://localhost:3000/static/js/bundle.js:44213:11)
    at commitPassiveMountEffects (http://localhost:3000/static/js/bundle.js:44203:7)
    at flushPassiveEffectsImpl (http://localhost:3000/static/js/bundle.js:46086:7)
    at flushPassiveEffects (http://localhost:3000/static/js/bundle.js:46039:18)
    at http://localhost:3000/static/js/bundle.js:45854:13**/}