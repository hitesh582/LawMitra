import React, { useContext, useEffect, useState } from 'react'
import { LawyerDataContext } from '../context/LawyerContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LawyerProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('lawyer-token')
    const navigate = useNavigate()
    const { lawyer, setLawyer } = useContext(LawyerDataContext)
    const [ isLoading, setIsLoading ] = useState(true)




    useEffect(() => {
        if (!token) {
            navigate('/lawyerlogin')
        }

        axios.get(`${import.meta.env.VITE_API_URL}/lawyers/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setLawyer(response.data.lawyer)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('lawyer-token')
                navigate('/lawyerlogin')
            })
    }, [ token ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default LawyerProtectWrapper