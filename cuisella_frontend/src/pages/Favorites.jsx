import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiEye } from "react-icons/fi"

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setMessage("Please login to view your favorites")
        setTimeout(() => setMessage(""), 3000)
        navigate("/login")
        return
      }
      try {
        const res = await fetch("http://localhost:8000/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        })
        if (!res.ok) throw new Error("Failed to fetch favorites")
        const data = await res.json()
        setFavorites(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [navigate])

  if (loading) return <p className="pt-20 text-center text-[#4B352A] font-semibold">Loading favorites...</p>
  if (error) return <p className="pt-20 text-center text-red-500 font-semibold">{error}</p>

  return (
    <div className="bg-[#EFE4D2] min-h-screen px-4 py-8 mt-16">
      {message && <div className="fixed top-5 right-5 bg-[#E6521F] text-white px-4 py-2 rounded shadow-lg z-50">{message}</div>}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[#CA7842] mb-10 text-center">Your Favorite Recipes</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4B352A] mb-4 font-semibold">You haven't added any favorite recipes yet.</p>
            <Link to="/recipes" className="text-[#CA7842] hover:text-[#954C2E] font-medium">Explore Recipes →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
            {favorites.map(({ id, recipe }) => (
              <div key={id} className="relative bg-[#F1EFEC] rounded-3xl shadow-md pt-24 px-5 pb-5 flex flex-col">
                {recipe.image_path && (
                  <img
                    src={`http://localhost:8000/storage/${recipe.image_path}`}
                    alt={recipe.title}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md absolute -top-10 left-1/2 transform -translate-x-1/2"
                  />
                )}

                <div className="px-5 pb-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#4B352A] mb-2 text-center">{recipe.title}</h3>
                  <p className="text-[#4B352A] mb-4 line-clamp-2 text-sm">{recipe.description || "No description available."}</p>

                  <div className="flex justify-between items-center text-sm text-[#4B352A] mb-4">
                    <span>
                      {recipe.time && (
                        <span className="inline-flex items-center mr-4">
                          <FiEye className="mr-1" /> {recipe.time}
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="inline-flex items-center">
                          <FiEye className="mr-1" /> {recipe.servings} servings
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="mt-auto flex justify-center">
                    <Link to={`/recipes/${recipe.id}`} className="text-[#CA7842] hover:text-[#954C2E] flex items-center gap-1" title="View Recipe">
                      <FiEye size={18} /> View Recipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites