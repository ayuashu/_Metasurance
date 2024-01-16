'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImCross } from 'react-icons/im';

const HOST = 'http://localhost:3000'

const PurchaseToken = ({ username, amount, onBalanceUpdate, isModal }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [balance, setBalance] = useState(parseInt(amount, 10));

  console.log('Balance:', balance)
  const handleClose = async() => {
    setIsOpen(false);
    try{
      const response = await fetch(`${HOST}/api/company/updatebalance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, balance: String(balance) }),
      })

      if (response.status === 200) {
        let res = await response.json()
        console.log('Updated balance:', res.reply.balance)
        onBalanceUpdate(res.reply.balance); // Notify the parent component about the updated balance
      }
    } catch (error) {
      console.log(error)
    }
    isModal(false);
  };

  const handleBuy = async () => {
    try{
      const response = await fetch(`${HOST}/api/company/gettokenvalue`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.status === 200) {
        let res = await response.json()
        const tokenValue = parseInt(res.reply.value, 10);
  
        setBalance((balance) => balance + parseInt((tokenValue/tokenValue),10))
        onBalanceUpdate(balance + parseInt((tokenValue/tokenValue),10)); // Notify the parent component about the updated balance
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-100"
            onClick={handleClose}
          ></div>

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="fixed bottom-1/4 right-1/3 w-96 h-2/3 bg-white drop-shadow-md flex flex-col z-[101] rounded-xl"
          >
            <div className="w-full flex items-center justify-between p-4 cursor-pointer">
              <p>   </p>
              <p className="text-textColor text-lg font-semibold">Purchase</p>

              <motion.p
                whileTap={{ scale: 0.75 }}
                className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md cursor-pointer text-textColor text-base"
                onClick={handleClose}
              >
                <ImCross />
              </motion.p>
            </div>
            <div className="w-full h-1/2 rounded-t-[2rem] flex flex-col items-center justify-center px-8 py-2">
              <p className="text-gray-400 text-lg">
                <button
                  className="h-10 px-6 text-indigo-100 text-lg transition-colors duration-150 bg-slate-700 rounded-full focus:shadow-outline hover:bg-slate-900"
                  onClick={handleBuy}
                >
                  <b>Buy</b>
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default PurchaseToken;
