import React, { useState } from "react"
import { FaStar, FaRegStar } from "react-icons/fa"

const Rating = ({ recipeId, currentUserRating = 0, averageRating = 0, ratingCount = 0, onRatingSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const submitRating = async (ratingValue) => {
    if (submitting) return
    const token = localStorage.getItem("auth_token")
    if (!token) {
      message("Please login to rate recipes")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("http://localhost:8000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipe_id: recipeId, rating: ratingValue })
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to submit rating")
      }
      const data = await res.json()
      if (onRatingSubmit) onRatingSubmit(data.average_rating, data.rating_count, ratingValue)
    } catch (err) {
      console.error("Rating error:", err)
      message(err.message || "Failed to submit rating")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => submitRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} disabled={submitting} className="focus:outline-none" aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}>
            {star <= (hoverRating || currentUserRating) ? <FaStar className="text-yellow-400 text-xl" /> : <FaRegStar className="text-gray-300 text-xl hover:text-yellow-400" />}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-600">{averageRating.toFixed(1)} ({ratingCount} ratings){submitting && <span className="ml-2">Saving...</span>}</div>
    </div>
  )
}

export default Rating