import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TimerPage = () => {
  const navigate = useNavigate()
  const [time, setTime] = useState(20)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval)
          navigate('/lawyerhome')
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Once you are verified you will be informed through mail
        </h2>
        <div className="mb-6">
          {/* Replace the placeholder image src with your actual image */}
          <img
            src="https://via.placeholder.com/300x200"
            alt="Verification"
            className="mx-auto rounded"
          />
        </div>
        <p
          className="text-lg text-blue-500 cursor-pointer underline"
          onClick={() => navigate('/lawyerhome')}
        >
          You can go to the home page or you will be redirected to home page in {time} seconds
        </p>
      </div>
    </div>
  )
}

export default TimerPage
