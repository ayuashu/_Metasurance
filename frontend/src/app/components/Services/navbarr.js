"use client";
import React from 'react'
 
 const Navbarr = ({filterItem,itemList}) => {
   return (
     <>
       <nav className="navbar">
          <div className="btn-group">
            {itemList.map((curElem) => {
              return (
                <button
                  className="btn-group__item"
                  onClick={() => filterItem(curElem)}>
                  {curElem}
                </button>
              );
            })}
          </div>
        </nav>
     </>
   )
 }
 
export default Navbarr
 