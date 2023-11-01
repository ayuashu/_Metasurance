"use client"

import React, { useState, useEffect } from 'react';
import Navbarr from './navbarr';
import './style.css';
import Footer from '../Footer/footer';
import Navigation from '../Navigation/page';
import ServiceItem from './serviceItem';

const Services = () => {
  const [itemData, setItemData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${HOST}/api/user/policy/viewall`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                const uniqueCategories = [
                  'All',
                  ...new Set(data.map((curElem) => curElem.insuranceType)),
                ];
                setItemList(uniqueCategories);
                setItemData(data);
                console.log(data)
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    fetchData(); // Call the fetchData function when the component mounts
}, []);


  const filterItem = (category) => {
    setSelectedCategory(category);
  };

  const filteredData =
    selectedCategory === 'All'
      ? itemData
      : itemData.filter((item) => item.insuranceType === selectedCategory);

  return (
    <>
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
        <Navigation />
        <div>
          <Navbarr filterItem={filterItem} itemList={itemList} />
          <ServiceItem itemData={filteredData} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Services;
