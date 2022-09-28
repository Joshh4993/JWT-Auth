/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const CreateCompany = () => {
    const [expire, setExpire] = useState('')
    const [token, setToken] = useState('')

    const [name, setName] = useState('')
    const [postcode, setPostcode] = useState('')
    const [citytown, setCitytown] = useState('')
    const [addressline, setAddressline] = useState('')
    const [registration_num, setRegistration_num] = useState('')
    const [contact_email, setContact_email] = useState('')
    const [contact_number, setContact_number] = useState('')

    const [msg, setMsg] = useState('')
    const history = useNavigate()

    useEffect(() => {
        refreshToken()
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
            verifyFlag("CLIENTELLE_CREATE", JSON.parse(decoded.access_flags))
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
            verifyFlag("CLIENTELLE_CREATE")
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const CreateCompany = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/companies/company', {
                name: name,
                postcode: postcode,
                citytown: citytown,
                addressline: addressline,
                registration_num: registration_num,
                contact_email: contact_email,
                contact_number: contact_number
            })
            history("/dashboard")
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
                            <form onSubmit={CreateCompany} className='box'>                             
                                <div className='field mt-5'>
                                    <label className='label'>Company Name</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Name'
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Address Line</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Address Line'
                                            value={addressline} onChange={(e) => setAddressline(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>City/Town</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='City/Town'
                                            value={citytown} onChange={(e) => setCitytown(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>PostCode</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Postcode'
                                            value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Companies House Registration Number</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Reg No.'
                                            value={registration_num} onChange={(e) => setRegistration_num(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Company Contact Email</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Contact Email'
                                            value={contact_email} onChange={(e) => setContact_email(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Company Contact Number</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Contact Number'
                                            value={contact_number} onChange={(e) => setContact_number(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <button className='button is-success is-fullwidth'>Create Company</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CreateCompany