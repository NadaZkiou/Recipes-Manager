import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import RatingStars from "./Rating"
import spices from '../assets/spices.jpg'
import { FaHeart } from "react-icons/fa"

const Home = ({ loggedInUser }) => {
  const [popularRecipes, setPopularRecipes] = useState([])
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/recipes/popular")
        if (!res.ok) throw new Error("Failed to fetch popular recipes")
        const data = await res.json()
        setPopularRecipes(data.slice(0, 6))
      } catch (error) {
        console.error(error)
      }
    }
    fetchPopularRecipes()
  }, [])

  const handleAddFavorite = async (recipeId) => {
    if (!loggedInUser) {
      setMessage("Please login to add favorites")
      setTimeout(() => setMessage(""), 3000)
      return
    }
    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch("http://localhost:8000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipe_id: recipeId })
      })
      if (!res.ok) throw new Error("Failed to add favorite")
      setMessage("Recipe added to favorites!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(error.message)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleRatingUpdate = (recipeId, avgRating, ratingCount, userRating) => {
    setPopularRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, average_rating: avgRating, rating_count: ratingCount, user_rating: userRating } : r))
  }

 return (
  <div className="bg-[#EFE4D2] min-h-screen pb-10">
    {message && (
      <div className="fixed top-5 right-5 bg-[#E6521F] text-white px-4 py-2 rounded shadow-lg z-50">
        {message}
      </div>
    )}

    <section
      className="flex flex-col justify-center items-start px-6 md:px-20 text-left pt-32 md:pt-48 pb-20"
      style={{
        backgroundImage: `url(${spices})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "600px",
      }}
    >
      <h1 className="text-5xl md:text-6xl font-serif font-extrabold leading-tight text-[#CA7842]">
        Discover <span className="text-[#EFE4D2]">& Share</span>
      </h1>
      <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#CA7842] mt-3 leading-tight">
        Delicious Recipes
      </h2>
      <p className="text-lg md:text-xl text-[#EFE4D2] max-w-xl mt-6 leading-relaxed font-sans">
        Join our sweet community of food lovers! Share your favorite recipes,
        discover new dishes, and connect with passionate cooks from around the world.
      </p>
      <div className="mt-10">
        <button
          onClick={() => navigate("/recipes")}
          className="bg-[#CA7842] text-white px-6 py-3 rounded font-semibold hover:bg-[#954C2E] transition"
        >
          See More Recipes
        </button>
      </div>
    </section>

    <section className="max-w-6xl mx-auto mt-20 px-6 md:px-0">
      <h3 className="text-3xl font-serif font-semibold mb-10 text-center text-[#CA7842]">
        Top Recipes
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {popularRecipes.length === 0 && (
          <p className="text-[#4B352A] text-center col-span-full">Loading popular recipes...</p>
        )}
        {popularRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-[#F1EFEC] rounded-3xl shadow-lg overflow-hidden p-5 flex flex-col"
          >
            <img
              src={recipe.image_path ? `http://localhost:8000/storage/${recipe.image_path}` : "/placeholder.png"}
              alt={recipe.title}
              className="h-48 w-48 mx-auto object-cover rounded-full mb-4 border-4 border-[#EFE4D2] shadow-md"
            />

            <h4 className="text-xl font-bold text-[#4B352A] mb-2 text-center">{recipe.title}</h4>

            <div className="flex items-center gap-2 mb-4 justify-center">
              <RatingStars
                recipeId={recipe.id}
                currentUserRating={recipe.user_rating || 0}
                averageRating={recipe.average_rating || 0}
                ratingCount={recipe.rating_count || 0}
                onRatingSubmit={(avg, count, userRating) =>
                  handleRatingUpdate(recipe.id, avg, count, userRating)
                }
              />
              <span className="text-[#CA7842] text-sm font-semibold">
                {recipe.average_rating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <div className="mt-auto flex justify-between items-center">
              <Link
                to={`/recipes/${recipe.id}`}
                className="bg-[#CA7842] text-white py-2 px-4 rounded-full hover:bg-[#954C2E] transition text-sm"
              >
                More Details
              </Link>

              <button
                onClick={() => handleAddFavorite(recipe.id)}
                className="text-[#CA7842] text-xl hover:text-[#954C2E] transition"
                aria-label="Add to Favorites"
              >
                <FaHeart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
)


}

export default Home