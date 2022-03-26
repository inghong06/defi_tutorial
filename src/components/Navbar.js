import React from 'react'
import "./navbar.css"

const Navbar = ({account}) => {
  return (
    <div className="navbar">
      <div>LP Token Farm</div>
      <div>{account}</div>
    </div>
  )
}

export default Navbar