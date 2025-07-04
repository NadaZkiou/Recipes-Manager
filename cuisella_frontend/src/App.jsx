import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { checkAuth } from './utils/auth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LoginRegister from './pages/LoginRegister'
import UserRecipes from './pages/UserRecipes'
import AddRecipe from './pages/AddRecipe'
import Favorites from './pages/Favorites'
import EditRecipe from './pages/EditRecipe'
import ViewRecipeDetails from './pages/ViewRecipeDetails'
import Recipes from './pages/Recipes'
function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth()
      setLoggedInUser(user)
      setIsLoading(false)
    }
    verifyAuth()
  }, [])

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDCEDF]"></div></div>

  return (
    <Router>
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      <Routes>
        <Route path="/" element={<Home loggedInUser={loggedInUser} />} />
        <Route path="/login" element={<LoginRegister setLoggedInUser={setLoggedInUser} />} />
        <Route path="/my-recipes" element={<UserRecipes loggedInUser={loggedInUser} />} />
        <Route path="/favorites" element={<Favorites loggedInUser={loggedInUser} />} />
        <Route path="/add-recipe" element={<AddRecipe loggedInUser={loggedInUser} />} />
        <Route path='/edit-recipe/:id' element={<EditRecipe loggedInUser={loggedInUser} />} />
        <Route path="/recipes/:id" element={<ViewRecipeDetails />} />
        <Route path="/recipes" element={<Recipes />} />
        


        
      </Routes>
    </Router>
  )
}

export default App