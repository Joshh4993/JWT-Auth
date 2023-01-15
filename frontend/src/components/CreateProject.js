/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const CreateProject = () => {
    const [expire, setExpire] = useState('')
    const [token, setToken] = useState('')


    const [creator, setCreator] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [project_ref, setProject_ref] = useState('')
    const [private_, setPrivate_] = useState('')

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
            setCreator(decoded.userId)
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
            verifyFlag("CLIENTELLE_CREATE", JSON.parse(decoded.access_flags))
            setCreator(decoded.userId)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const CreateProject = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/projects/project', {
                name: name,
                creator: creator,
                description: description,
                project_ref: project_ref,
                private_: private_
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
                            <form onSubmit={CreateProject} className='box'>
                                <div className='field mt-5'>
                                    <label className='label'>Project Name</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Name'
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Description</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Address Line'
                                            value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Project Ref</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='City/Town'
                                            value={project_ref} onChange={(e) => setProject_ref(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <label className='label'>Private</label>
                                    <div className='controls'>
                                        <input type="text" className='input' placeholder='Postcode'
                                            value={private_} onChange={(e) => setPrivate_(e.target.value)} />
                                    </div>
                                </div>
                                <div className='field mt-5'>
                                    <button className='button is-success is-fullwidth'>Create Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CreateProject