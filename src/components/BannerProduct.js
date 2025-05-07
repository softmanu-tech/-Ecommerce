import React, { useEffect, useState } from 'react'
import image1 from '../assest/banner/img.png'
import image1Mobile from '../assest/banner/img.png'
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/img3.jpg'
import image4 from '../assest/banner/img4.jpg'
import image5 from '../assest/banner/im.png'

import image2Mobile from '../assest/banner/img2_mobile.webp'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/im.png'
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import AnimatedButton from './AnimatedButton';
import styles from './BannerProduct.module.css';





const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false);

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5

    ]
    const mobileImages = [
      image1Mobile,
      image2Mobile,
      image3Mobile,
      image4Mobile,
      image5Mobile
        

    ]

    const nextImage = () =>{
      if(desktopImages.length -1 > currentImage){
        setCurrentImage(preve => preve + 1)
      }
      if (!isTransitioning){
        setIsTransitioning(true);
        setCurrentImage((preve) => (preve + 1) %desktopImages.length); 
      }
      

    }
    const preveImage = () =>{
      if(currentImage != 0){ 
        setCurrentImage(preve => preve - 1)
      }
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImage((prev) => (prev - 1 + desktopImages.length) % desktopImages.length);
      }
  
      

    }
    useEffect (() => {
      const interval = setInterval(() => {
        if(desktopImages.length -1 > currentImage){
          nextImage()
        
        }else{
          setCurrentImage(0)
        }
        
      },5000); // Match this with your transition duration
  
      return () => clearInterval(interval);
    }, [currentImage]);
  return (
    <div className='container mx-auto px-4 rounded'>
      <div className='h-56 md:72 w-full bg-slate-300 relative'>
        <div className='flex h-full w-full'>
          <div className='absolute z-10 h-full w-full flex items-center'>
            <div className=' flex justify-between w-full text-3xl'>
              <AnimatedButton direction="left" onClick={preveImage}  />
              <AnimatedButton direction="right" onClick={nextImage} />
            </div>
            
          </div>
            <div className='flex h-full w-full overflow-hidden'>
                {
                    desktopImages.map((imageURl,index)=>{
                        return(
                            <div className='w-full h-full min-w-full min-h-full transition-transform duration-300 ease-in-out' key={imageURl} style={{transform: `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-full'/>
                            </div>

                        )
                    })
                }
            </div>
        </div>
      </div>
    </div>
  )
}

export default BannerProduct
