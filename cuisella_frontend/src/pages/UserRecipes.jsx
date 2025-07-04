import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiEdit, FiTrash2, FiEye, FiClock, FiUsers } from "react-icons/fi"

const UserRecipes = ({ loggedInUser }) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch("http://localhost:8000/api/user/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          },
          credentials: "include"
        })
        if (!response.ok) throw new Error("Failed to fetch recipes")
        const data = await response.json()
        setRecipes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`http://localhost:8000/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Failed to delete recipe")
      setRecipes(recipes.filter(recipe => recipe.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-center text-[#4B352A] py-8">Loading...</div>
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>

  return (
    <div className="bg-[#EFE4D2] min-h-screen px-4 py-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#CA7842]">My Recipes</h1>
          <Link
            to="/add-recipe"
            className="bg-[#CA7842] text-white px-4 py-2 rounded font-semibold hover:bg-[#954C2E] transition"
          >
            Add New Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4B352A] mb-4">You haven't created any recipes yet.</p>
            <Link to="/add-recipe" className="text-[#CA7842] hover:text-[#954C2E] font-medium">
              Create your first recipe →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 py-10">
            {recipes.map(recipe => (
            <div key={recipe.id} className="relative bg-[#F1EFEC] rounded-3xl shadow-md pt-24 px-5 pb-5 flex flex-col">
  {recipe.image_path && (
    <img
      src={`http://localhost:8000/storage/${recipe.image_path}`}
      alt={recipe.title}
      className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md absolute -top-10 left-1/2 transform -translate-x-1/2"
    />
  )}

                <div className="px-5 pb-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#4B352A] mb-2">{recipe.title}</h3>
                  <p className="text-[#4B352A] mb-4 line-clamp-2 text-sm">{recipe.description}</p>

                  <div className="flex justify-between items-center text-sm text-[#4B352A] mb-4">
                    <span><FiClock className="inline mr-1" /> {recipe.time}</span>
                    <span><FiUsers className="inline mr-1" /> {recipe.servings} servings</span>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <Link to={`/recipes/${recipe.id}`} className="text-[#CA7842] hover:text-[#954C2E]" title="View">
                      <FiEye size={18} />
                    </Link>
                    <Link to={`/edit-recipe/${recipe.id}`} className="text-[#CA7842] hover:text-[#954C2E]" title="Edit">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(recipe.id)} className="text-[#CA7842] hover:text-red-500" title="Delete">
                      <FiTrash2 size={18} />
                    </button>
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

export default UserRecipes