import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Rating from "./Rating"

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favLoadingIds, setFavLoadingIds] = useState(new Set())
  const navigate = useNavigate()
  const recipesPerPage = 9

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:8000/api/recipes?page=${currentPage}&limit=${recipesPerPage}`)
        if (!res.ok) throw new Error("Failed to fetch recipes")
        const data = await res.json()
        setRecipes(data.data)
        setTotalPages(data.last_page)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [currentPage])

  const addToFavorites = async (recipeId) => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      message("Please login to add favorites")
      navigate("/login")
      return
    }
    try {
      setFavLoadingIds(prev => new Set(prev).add(recipeId))
      const res = await fetch("http://localhost:8000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipe_id: recipeId })
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to add to favorites")
      }
      message("Added to favorites!")
    } catch (err) {
      message(err.message)
    } finally {
      setFavLoadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(recipeId)
        return newSet
      })
    }
  }

  const handleRatingUpdate = (recipeId, avgRating, ratingCount, userRating) => {
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, average_rating: avgRating, rating_count: ratingCount, user_rating: userRating } : r))
  }

  const renderPagination = () => (
    <div className="flex justify-center mt-8 space-x-2">
      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">Previous</button>
      {[...Array(totalPages)].map((_, idx) => {
        const page = idx + 1
        return <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded ${currentPage === page ? "bg-[#E6521F] text-white" : "bg-gray-200 text-gray-800"}`}>{page}</button>
      })}
      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">Next</button>
    </div>
  )

  if (loading) return <p>Loading recipes...</p>
  if (error) return <p className="text-red-500">{error}</p>

return (
  <div className="bg-[#EFE4D2] min-h-screen px-6 py-15 pt-30">
    <h2 className="text-3xl font-serif font-bold mb-10 text-center text-[#CA7842]">Discover All Recipes</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15 max-w-6xl mx-auto">
      {recipes.map(recipe => (
        <div key={recipe.id} className="relative bg-[#F1EFEC] rounded-3xl shadow-lg pt-24 px-6 pb-6 flex flex-col">
          {recipe.image_path && (
            <img
              src={`http://localhost:8000/storage/${recipe.image_path}`}
              alt={recipe.title}
              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md absolute -top-10 left-1/2 transform -translate-x-1/2"
            />
          )}
          <h3 className="text-xl font-semibold text-[#4B352A] mb-2 text-center">{recipe.title}</h3>
          <p className="text-[#4B352A] mb-3 text-sm line-clamp-2 text-center">
            {recipe.description?.slice(0, 100)}...
          </p>

          <Rating
            recipeId={recipe.id}
            currentUserRating={recipe.user_rating || 0}
            averageRating={recipe.average_rating || 0}
            ratingCount={recipe.rating_count || 0}
            onRatingSubmit={(avg, count, userRating) =>
              handleRatingUpdate(recipe.id, avg, count, userRating)
            }
          />

          <div className="mt-4 flex justify-between items-center">
            <Link
              to={`/recipes/${recipe.id}`}
              className="bg-[#CA7842] text-white py-1 px-4 rounded-full text-sm hover:bg-[#954C2E] transition"
            >
              More Details
            </Link>

            <button
              onClick={() => addToFavorites(recipe.id)}
              disabled={favLoadingIds.has(recipe.id)}
              className="bg-[#E6521F] text-white px-3 py-1 rounded-full hover:bg-[#D04118] transition disabled:opacity-50 text-sm"
            >
              {favLoadingIds.has(recipe.id) ? "Adding..." : "Add to Favorites"}
            </button>
          </div>
        </div>
      ))}
    </div>

    {renderPagination()}
  </div>
)


}

export default Recipes