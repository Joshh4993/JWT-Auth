/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from 'react-router-dom'

const ViewSPToken = () => {
    const [expire, setExpire] = useState('')
    const [token, setToken] = useState('')

    const { sptokenId } = useParams()
    const { reference, setReference } = useState({})
    const { spToken, setSpToken } = useState({})

    const [msg, setMsg] = useState('')
    const history = useNavigate()

    useEffect(() => {
        refreshToken()
        getSPTokenDetails()
    }, [])

    const verifyFlag = (flag, user_flags) => {
        if (!user_flags.includes(flag)) {
            history("/dashboard")
        }
    }

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            verifyFlag("SPTOKENS", JSON.parse(decoded.access_flags))
            setExpire(decoded.exp)
        } catch (error) {
            if (error.response) {
                history("/")
            }
        }
    }

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/users/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            verifyFlag("SPTOKENS", JSON.parse(decoded.access_flags))
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getSPTokenDetails = async () => {
        try {
            let response = await axios.post('http://localhost:5000/sptokens/lookuptoken', { token_id: sptokenId });
            let rdata = response.data
            setSpToken(spToken => ({
                ...spToken,
                ...rdata
            }))
            switch (rdata.token_type) {
                case "PWD_RST":
                    let usrresponse = await axios.post('http://localhost:5000/users/lookupuser', { id: rdata.reference_id });
                    console.log(usrresponse)
                    setReference(reference => ({
                        ...reference,
                        ...usrresponse.data
                    }))
                    break;
                default:
                    break;
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }

    return (
        <section className='hero has-background-grey-light is-fullheight is-fullwidth'>
            <div className='hero-body'>
                <div className='container'>
                    <div className='columns is-centered'>
                        <div className='column is-4-desktop'>
                            <p className='has-text-cenetred'>{msg}</p>
                            <p className='has-text-cenetred'>Token ID: {sptokenId}</p>
                            {spToken.token_type === "PWD_RST" ? <p className='has-text-cenetred'>User's Name: {reference.name}</p> : <p className='has-text-cenetred'>no Details.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ViewSPToken