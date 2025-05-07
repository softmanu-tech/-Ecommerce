import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayKshCurrency from '../helpers/displayCurrency'
import AnimatedButton from './AnimatedButton'
import ComplexLoader from './ComplexLoader'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'


const HozizontalCardProject = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const loadingList = new Array(13).fill(null)

    const [scroll,setSCroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)
    const handleAddToCart = async(e,id)=>{
        await addToCart(e,id)
        fetchUserAddToCart()
    }
    

    const fetchData = async() =>{
        const startTime = Date.now();
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
         

        setData(categoryProduct?.data)
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }

        setData(categoryProduct?.data);
        setLoading(false)
    }

    useEffect(() =>{
        fetchData()

    },[])

    const scrollRight = () =>{
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{
        scrollElement.current.scrollLeft -= 300
    }

    



 
  return (   
    <div className='horizontal-card-project'>
        
        <div className='scroll-container' ref={scrollElement}>
            {loading ? (
                <div className='loader-container'>
                    <ComplexLoader />
                    <p>Loading available products ...</p>
                </div>

            ) : (
                <div className='container mx-auto px-4 my-6 relative'>
        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
        


        <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all' ref={scrollElement}>
            <button className='p-0.5 text-sm hidden md:block absolute left-0 'onClick={scrollLeft}><AnimatedButton direction="left"/></button>
            <button className='p-0.5 text-sm hidden md:block absolute right-0'onClick={scrollRight}><AnimatedButton direction="right"/></button>
                {
                    data.map((product,index) =>{
                        
                        return(
                            <Link to={"product/"+product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex scrollbar-none'>
                                <div className='bg-slate-300 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                                    <img src={product.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all ' />

                                </div>
                                <div className='p-4'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product.category}</p>
                                    <div className=''>
                                        <p className='text-red-600 font-medium'>{displayKshCurrency(product?.sellingPrice) }</p>
                                        <p className='text-slate-500 line-through text-sm'>{ displayKshCurrency(product?.price)}</p>
                                    </div>
                                    <button className='bg-red-600 hover:bg-red-700 text-white  text-sm font-medium px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                                </div>
                                

                            </Link>
                            



                        )
                    })
                }
        </div>
      
      
    </div>

            )}
        </div>

    </div>
    
  )
}

export default HozizontalCardProject
