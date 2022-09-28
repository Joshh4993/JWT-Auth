import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import OpenPayrollLogo from '../static-media/OpenPayroll.png'

const Navbar = () => {
    const history = useNavigate()

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/users/logout')
            history("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <nav className='navbar is-light' role='navigation' aria-label='main navigation'>
            <div className='container'>
                <div className='navbar-brand'>
                    <a className='navbar-item' href='https://bulma.io'>
                        <img src={OpenPayrollLogo} width="100%" height="100%" alt='logo' />
                    </a>

                    <a href="/" role="button" className='navbar-burger burger' aria-label='menu' aria-expanded="false" data-target="mainNavbar">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="mainNavbar" className='navbar-menu'>
                    <div className='navbar-start'>
                        <a href='/company/create' className='navbar-item'>
                            Create a Company
                        </a>
                    </div>

                    <div className='navbar-end'>
                        <div className='navbar-item'>
                            <div className='buttons'>
                                <button onClick={Logout} className="button is-light">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar