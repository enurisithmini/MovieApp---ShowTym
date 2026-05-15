import React from 'react'

export default function Navbar() {
  return (
    <div className='main lg:flex md:flex shadow-md flex-wrap justify-between items-center justify-center 
    px-3 py-4 bg-gray-800 text-white sticky top-0'>
        <div className="left flex items-center space-x-6 ml-10 justify-center ">
            <img src="https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW92aWV8ZW58MHx8MHx8fDA%3D"
             alt="logo" className="logo w-16 h-16 rounded-full" />  
            <h1 className="title font-bold text-4xl">ShowTym</h1>
        </div>
        <div className="right">
                < ul className='flex space-x-8 justify-center'>
                    <li>Home</li>
                    <li>Movies</li>
                    <li>TV Shows</li>
                    <li>My List</li>
                    <li>Contact</li>
                </ul>
        </div>
    </div>
  )
}
