import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const TimerPage = () => {
  const navigate = useNavigate()
  const [time, setTime] = useState(20)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate('/lawyerhome')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-cover bg-center mt-0.5"
      style={{ backgroundImage: `url('${assets.Rectangle}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-black bg-opacity-80 p-10 rounded-2xl shadow-2xl text-center max-w-md mx-auto mb-18"
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Once verified, you will be informed by mail
        </motion.h2>

        <motion.div
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <img
            src={assets.verifyicon}
            alt="Verification Success"
            className="mx-auto rounded filter grayscale"
          />
        </motion.div>

        <motion.p
          className="text-lg text-white cursor-pointer"
          onClick={() => navigate('/lawyerhome')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          You can go to the home page by clicking here or you'll be redirected in {time} seconds
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default TimerPage
