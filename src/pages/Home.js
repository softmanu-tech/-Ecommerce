import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HozizontalCardProject from '../components/HozizontalCardProject'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct /> 
      <HozizontalCardProject  category= {"airpodes"} heading={"Top's Airpodes"}/>
      <HozizontalCardProject  category= {"watches"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category= {"mobiles"} heading={"Mobiles"}/>
      <VerticalCardProduct category= {"televisions"} heading={"Best Television Models"}/>
      <VerticalCardProduct category= {"camera"} heading={" Camera and Photography"}/>
      <VerticalCardProduct category= {"earphones"} heading={""}/>
      <VerticalCardProduct category= {"speakers"} heading={""}/>
      <VerticalCardProduct category= {"refrigerator"} heading={""}/>
      <VerticalCardProduct category= {"printers"} heading={""}/>
      <VerticalCardProduct category= {"trimmers"} heading={""}/>
    </div>
  )
}

export default Home