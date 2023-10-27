"use client"
import React, { useState} from 'react'
import Navbarr from './navbarr'
import './style.css'
import Footer from '../Footer/footer'
import Navigation from '../Navigation/page'
import ServiceItem from './serviceItem'
import Products from './service'

const uniqueList = [
  ...new Set(
    Products.map((curElem) => {
      return curElem.category;
    })
  ),
  "All",
];

const Services = () => {
  const [itemData, setItemData] = useState(Products);
  const [itemList, setItemList] = useState(uniqueList);

  const filterItem = (category) => {
    if (category === "All") {
      setItemData(Products);
      return;
    }

    const updatedList = Products.filter((curElem) => {
      return curElem.category === category;
    });

    setItemData(updatedList);
  };

  return (
    <>
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"> 
        <Navigation/>
        <div>
          <Navbarr filterItem={filterItem} itemList={itemList} />  
          <ServiceItem itemData={itemData} />
        </div>
        <Footer/> 
      </div>
    </>
  );
};

export default Services;
