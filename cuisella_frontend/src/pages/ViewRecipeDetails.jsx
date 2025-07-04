import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  FiBookOpen,
  FiClock,
  FiUsers,
  FiList,
  FiEdit3,
} from "react-icons/fi"
import RatingStars from "./Rating"

const ViewRecipeDetails = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setError("You must be logged in to view this recipe")
          return
        }
        const response = await fetch(
          `http://localhost:8000/api/recipes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            credentials: "include",
          }
        )
        if (!response.ok) throw new Error("Failed to fetch recipe details")
        const data = await response.json()
        setRecipe(data)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchRecipe()
  }, [id])

  const handleRatingUpdate = (avgRating, ratingCount, userRating) => {
    setRecipe((prev) => ({
      ...prev,
      average_rating: avgRating,
      rating_count: ratingCount,
      user_rating: userRating,
    }))
  }

  if (error)
    return (
      <div className="mt-32 text-center text-red-600 font-medium">{error}</div>
    )
  if (!recipe)
    return (
      <div className="mt-32 text-center text-gray-600">Loading recipe...</div>
    )

return (
  <div className="max-w-4xl mx-auto mt-40 bg-[#EFE4D2] p-8 rounded-2xl shadow-xl relative pt-24">

    {/* Image positioned absolutely */}
    {recipe.image_path ? (
      <img
        src={`http://localhost:8000/storage/${recipe.image_path}`}
        alt={recipe.title}
        className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md absolute -top-20 left-1/2 transform -translate-x-1/2"
      />
    ) : (
      <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 absolute -top-20 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md">
        No image
      </div>
    )}

    <h1 className="text-3xl font-bold text-center text-[#4B352A] mb-6 flex flex-col items-center gap-3">
      <span className="flex items-center gap-2">
        <FiBookOpen className="text-[#CA7842]" />
        {recipe.title}
      </span>
      {recipe.tag && (
        <div className="flex flex-wrap gap-2 justify-center">
          {recipe.tag.split(",").map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm text-[#4B352A] bg-[#f9e6ce] border border-[#CA7842] rounded-full"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </h1>

    <div className="grid grid-cols-2 gap-6 mb-6 text-[#4B352A]">
      <div className="flex items-center gap-2">
        <FiClock className="text-[#CA7842]" />
        <span>{recipe.time}</span>
      </div>
      <div className="flex items-center gap-2">
        <FiUsers className="text-[#CA7842]" />
        <span>{recipe.servings} serving(s)</span>
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#CA7842] mb-2 flex items-center gap-2">
        <FiEdit3 />
        Description
      </h2>
      <p className="text-[#4B352A]">{recipe.description}</p>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#CA7842] mb-2 flex items-center gap-2">
        <FiList />
        Ingredients
      </h2>
      <ul className="list-disc list-inside space-y-1 text-[#4B352A]">
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#CA7842] mb-2 flex items-center gap-2">
        <FiList />
        Steps
      </h2>
      <ol className="list-decimal list-inside space-y-1 text-[#4B352A]">
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>

    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[#CA7842] mb-2">
        Rate this recipe
      </h2>
      <RatingStars
        recipeId={recipe.id}
        currentUserRating={recipe.user_rating || 0}
        averageRating={recipe.average_rating || 0}
        ratingCount={recipe.rating_count || 0}
        onRatingSubmit={handleRatingUpdate}
      />
    </div>
  </div>
)

}

export default ViewRecipeDetails
