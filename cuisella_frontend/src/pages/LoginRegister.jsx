import React, { useState } from "react"
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:8000/api"

const LoginRegister = ({ setLoggedInUser }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => {
    setIsLogin(!isLogin)
    setError("")
    setMessage("")
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    if (!isLogin && formData.password !== formData.password_confirmation) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include"
      })

      const url = isLogin
        ? `${API_BASE_URL}/login`
        : `${API_BASE_URL}/register`

      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg =
          data.message ||
          data.errors?.email?.[0] ||
          data.errors?.password?.[0] ||
          "Something went wrong"
        throw new Error(errorMsg)
      }

      if (isLogin) {
        if (data.access_token) {
          localStorage.setItem("auth_token", data.access_token)
        }

        const userResponse = await fetch(`${API_BASE_URL}/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            Accept: "application/json"
          }
        })

        const userData = await userResponse.json()
        setLoggedInUser(userData)
        navigate("/")
      } else {
        setMessage("Registration successful! Please login.")
        setTimeout(() => setMessage(""), 3000)
        setIsLogin(true)
        setFormData(prev => ({
          ...prev,
          password: "",
          password_confirmation: ""
        }))
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-32 bg-[#EFE4D2] p-8 rounded-2xl shadow-xl">
      {message && (
        <div className="fixed top-5 right-5 bg-[#D97F3D] text-white px-4 py-2 rounded shadow-lg z-50">
          {message}
        </div>
      )}
      <h1 className="text-center text-3xl font-bold text-[#4B352A] mb-8">
        Welcome to Cuisella
      </h1>

      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 font-semibold rounded-lg transition ${
            isLogin
              ? "bg-[#D9A066] text-[#4B352A]"
              : "border border-[#D9A066] text-[#4B352A] bg-white"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 font-semibold rounded-lg transition ${
            !isLogin
              ? "bg-[#D9A066] text-[#4B352A]"
              : "border border-[#D9A066] text-[#4B352A] bg-white"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 text-center text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="relative mb-4">
            <FiUser className="absolute left-3 top-3 text-[#A47149]" />
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 pr-4 w-full py-2 border rounded-lg focus:ring-2 focus:ring-[#A47149] bg-white"
              required
            />
          </div>
        )}
        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3 text-[#A47149]" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="pl-10 pr-4 w-full py-2 border rounded-lg focus:ring-2 focus:ring-[#A47149] bg-white"
            required
          />
        </div>
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3 text-[#A47149]" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 pr-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-[#A47149] bg-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#A47149]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {!isLogin && (
          <div className="relative mb-4">
            <FiLock className="absolute left-3 top-3 text-[#A47149]" />
            <input
              name="password_confirmation"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="pl-10 pr-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-[#A47149] bg-white"
              required
            />
          </div>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className={`w-full py-3 bg-[#A47149] text-white font-bold rounded-lg hover:bg-[#6F4B2D] transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p
        className="text-center mt-6 text-sm text-[#4B352A] hover:underline cursor-pointer"
        onClick={handleToggle}
      >
        {isLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </p>
    </div>
  )
}

export default LoginRegister