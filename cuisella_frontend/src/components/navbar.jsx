import React from "react"
import { Link } from "react-router-dom"
import { BiFoodMenu } from "react-icons/bi"
import { FiHeart, FiPlusSquare, FiLogOut } from "react-icons/fi"
import logo from "../assets/logo.png"
import SearchBar from "./SearchBar"

const Navbar = ({ loggedInUser, setLoggedInUser }) => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      })
      localStorage.removeItem("auth_token")
      setLoggedInUser(null)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <nav className="bg-[#EFE4D2] shadow-md fixed w-full top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/"><img src={logo} alt="logo" className="w-[90px]" /></Link>
          
          <div className="relative w-[300px] hidden md:block"><SearchBar /></div>

          <div className="flex items-center space-x-6 text-[#4B352A]">
            {loggedInUser ? (
              <>
                <Link to="/my-recipes" title="My Recipes" className="hover:text-[#CA7842] text-2xl transition"><BiFoodMenu /></Link>
                <Link to="/favorites" title="Favorites" className="hover:text-[#CA7842] text-2xl transition"><FiHeart /></Link>
                <Link to="/add-recipe" title="Add Recipe" className="hover:text-[#CA7842] text-2xl transition"><FiPlusSquare /></Link>
                <button onClick={handleLogout} title="Logout" className="hover:text-[#CA7842] text-2xl transition"><FiLogOut /></button>
              </>
            ) : (
              <Link to="/login" className="bg-[#CA7842] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#954C2E] transition">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar