import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayKshCurrency from '../helpers/displayCurrency'
import ComplexLoader from './ComplexLoader'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({ loading, data = [] }) => {
    const { fetchUserAddToCart } = useContext(Context)
    
    const handleAddToCart = async(e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    return (
        <div className='horizontal-card-project'>
            <div className='scroll-container' >
                {loading ? (
                    <div className='loader-container'>
                        <ComplexLoader />
                        <p>Loading Available products . . .</p>
                    </div>
                ) : (
                    <div className='container mx-auto px-4 my-6 relative'>
                        {/* Remove the heading line or pass it as a prop if needed */}
                        <div className='md:grid md:grid-cols grid-cols-[repeat(auto-fit,minmax(300px,300px))] justify-between md:gap-5 overflow-x-scroll scrollbar-none transition-all'>
                            {data.map((product, index) => (
                                <Link key={product?._id} to={`/product/${product?._id}`} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow scrollbar-none' onClick={scrollTop}>
                                    <div className='bg-slate-300 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                        <img src={product?.productImage?.[0]} alt={product?.productName} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                    </div>
                                    <div className='p-4 grid gap-0'>
                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                        <p className='capitalize text-slate-500'>{product?.category}</p>
                                        <div className='flex gap-3'>
                                            <p className='text-red-600 font-medium'>{displayKshCurrency(product?.sellingPrice)}</p>
                                            <p className='text-slate-500 line-through text-sm'>{displayKshCurrency(product?.price)}</p>
                                        </div>
                                        <button className='bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerticalCard