import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <p> You are logged In</p>
            <Link to='/'> Logout </Link>
        </div>
    )
}

export default Home 