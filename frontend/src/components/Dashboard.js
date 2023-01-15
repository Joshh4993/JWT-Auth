/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [name, setName] = useState('')
    const [token, setToken] = useState('')
    const [accessFlags, setAccessFlags] = useState([])
    const [expire, setExpire] = useState('')
    const [users, setUsers] = useState([])
    const [projects, setProjects] = useState([])
    const history = useNavigate()

    //THIS IS FOR DEV ONLY
    const [specialTokens, setSpecialTokens] = useState([])

    useEffect(() => {
        refreshToken()
        getUsers()
        getAllProjects()
        getAllSpecialTokens()
    }, [])

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setName(decoded.name)
            setAccessFlags(decoded.access_flags)
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
            setName(decoded.name)
            setAccessFlags(decoded.access_flags)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setUsers(response.data)
    }

    const getAllSpecialTokens = async () => {
        const response = await axiosJWT.get('http://localhost:5000/sptokens/tokens', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setSpecialTokens(response.data)
    }

    const getAllProjects = async () => {
        const response = await axiosJWT.get('http://localhost:5000/projects/projects', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProjects(response.data)
    }

    return (
        <div className='container mt-5'>
            <h1>Welcome Back: {name}</h1>
            <h2>Your Flags: {accessFlags}</h2>
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Flags</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{JSON.parse(user.access_flags)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Creator</th>
                        <th>Reference Link</th>
                        <th>Private Project</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, index) => (
                        < tr key={project.id} >
                            <td>{index + 1}</td>
                            <td>{project.name}</td>
                            <td>{project.description}</td>
                            <td>{project.creator}</td>
                            <td>{project.project_ref}</td>
                            <td>{project.private ? <input type="checkbox" checked readOnly /> : <input type="checkbox" readOnly />}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className='table is-striped is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>TokenID</th>
                        <th>Reference ID</th>
                        <th>Expiry</th>
                        <th>Token Type</th>
                    </tr>
                </thead>
                <tbody>
                    {specialTokens.map((sptoken, index) => (
                        < tr key={sptoken.id} >
                            <td>{index + 1}</td>
                            <td>{sptoken.token_id}</td>
                            <td>{sptoken.reference_id}</td>
                            <td>{sptoken.expiry}</td>
                            <td>{sptoken.token_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

export default Dashboard