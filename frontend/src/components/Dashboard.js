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
    const [companies, setCompanies] = useState([])
    const history = useNavigate()

    useEffect(() => {
        refreshToken()
        getUsers()
        getAllCompanies()
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

    const getAllCompanies = async () => {
        const response = await axiosJWT.get('http://localhost:5000/companies/companies', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setCompanies(response.data)
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
                        <th>Address Line</th>
                        <th>City/Town</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company, index) => (
                        <tr key={company.id}>
                            <td>{index + 1}</td>
                            <td>{company.name}</td>
                            <td>{company.addressline}</td>
                            <td>{company.citytown}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard