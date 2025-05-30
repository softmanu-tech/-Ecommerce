import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa6";
import { FaStarHalf } from 'react-icons/fa';
import displayKshCurrency from '../helpers/displayCurrency';
import ComplexLoader from '../components/ComplexLoader';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : ""

  })

  const params = useParams ()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(0).fill(null)
  const [activeImage,setActiveImage] = useState("")

  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({
    x : 0,
    y : 0
  })
  const  [zoomImage,setZoomImage] = useState(false)

  const {fetchUserAddToCart} = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = async()=>{
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url,{
      method : SummaryApi.productDetails.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        productId : params?.id
      })
    })
    setLoading(false)
    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.productImage[0])

  }
  console.log("data",data)

  useEffect(()=>{
    fetchProductDetails()

  },[params])
  const handleMouseEnterProduct = (imgURL)=>{
    setActiveImage(imgURL)
  }
  const handleZoomImage = useCallback((e) =>{
    setZoomImage(true)
    const { left , top, width, height } = e.target.getBoundingClientRect()

    const x = (e.clientX - left ) / width
    const y = (e.clientY - top ) / height

    setZoomImageCoordinate({
      x,
      y
    })
    

  },[zoomImageCoordinate])

  const handleLeaveImageZoom = ()=>{
    setZoomImage(false)
  }
  const handleAddToCart = async(e,id) =>{
    await addToCart(e,id)
    fetchUserAddToCart()

  }
  const handleBuyProduct = async(e,id)=>{
    await addToCart(e,id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  return (
    <div className='container mx-auto p-8'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
      {/****product image**/}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

          <div className='h-[300px] w-[300px] lg:h-96 lg:96 bg-slate-200 relative p-2' >
            <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply ' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>
            {/*product zoom***/}

            {
              zoomImage && (

                <div className='hidden lg:block absolute min-w-[500px] min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'> 
                  <div 
                    className='w-full h-full min-h-[400px] min-w-[500px] overflow-hidden mix-blend-multiply '
                    style={{

                      backgroundImage : `url(${activeImage})`,
                      backgroundRepeat : "no-repeat",
                      backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                      
                    }}
                  
                  >

                  </div>

                </div>

              )
            }
            

          </div>
          <div className='h-full'>
            {
              loading ? (
                <div className='loader-container'>
                  <ComplexLoader/>
                  <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                  {
                    productImageListLoading.map(el => {
                      <ComplexLoader />
                      return(
                        <div className='h-20 w-20 bg-slate-200 rounded animate-pulse'key={""}>
    
                        </div>
                      )
    
                    })
                  }
                </div>

                </div>
                
                
                
              ) : (

                <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                  {
                    data?.productImage?.map((imgURL,index) => {
                      return(
                        <div className='h-20 w-20 bg-slate-200 rounded p-1'key={imgURL}>
                          <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)} onClick={()=>handleMouseEnterProduct(imgURL)}/>
    
                        </div>
                      )
    
                    })
                  }
                </div>
              )
            }
          </div> 
          
        </div>
        {/****product details**/}
        <div className='flex flex-col gap-1'>
          <p className='bg-red-200 text-red-600 px-2  text-center rounded-full inline-block w-fit'>{data?.brandName}</p>
          <h2 className='text-1xl lg:text-4xl font-medium'>{data?.productName}</h2>
          <p className='capitalize text-slate-400 '>  {data?.category}</p>
          <div className='text-red-600 flex items-center gap-1'> 
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStarHalf />
          </div>
          <div className='flex items-center gap-2 text-2xl lg:text-3xl font-mediummy-1 '>
            <p className='text-red-600'>{displayKshCurrency(data.sellingPrice)}</p>
            <p className='text-slate-400 line-through'>{displayKshCurrency(data.price)}</p>
         </div>
         <div className='flex items-center gap-3 my-2'>
          <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-800 font-bold bg-red-200 hover:bg-red-800 hover:text-white'onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy Now</button>
          <button className='border-2 font-bold border-white-800 rounded px-3 text-white py-1 min-w-[120px] bg-orange-600 hover:bg-green-800 ' onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>

         </div>
         <div>
          <p className='text-slate-600 font-medium my-1'> Description :</p>

          <p className='text-italic'>{data?.description}</p>
         </div>

        </div>
        
          

      </div>

      {
        data.category && (
          <CategoryWiseProductDisplay  category= {data?.category} heading={"Recommended Products"}/>
        )
      }
      

      
    </div>
  )
}

export default ProductDetails
