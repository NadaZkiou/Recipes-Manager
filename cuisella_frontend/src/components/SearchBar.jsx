import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FiSearch } from "react-icons/fi"

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api/recipes/search?q=${(searchQuery)}`,
        { headers: { Accept: "application/json" } }
      )
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      setSearchResults(data.data || data)
    } catch (err) {
      setError("Error fetching search results.")
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch}>
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search recipes..." className="w-full pl-4 pr-10 py-2 rounded-full border border-[#CA7842] focus:outline-none focus:ring-2 focus:ring-[#CA7842] bg-[#EFE4D2] text-[#4B352A] placeholder:text-[#A58D7B]" />
        <button type="submit" className="absolute right-3 top-2.5 text-[#CA7842] hover:text-[#954C2E] transition" title="Search"><FiSearch size={18} /></button>
      </form>

      {searchQuery && (
        <div className="absolute z-20 mt-2 w-full bg-[#EFE4D2] border border-[#CA7842] rounded-xl max-h-60 overflow-auto shadow-lg">
          {isSearching && <div className="p-2 text-[#4B352A] text-center">Searching...</div>}
          {error && <div className="p-2 text-red-500 text-center">{error}</div>}
          {!isSearching && !error && searchResults.length === 0 && <div className="p-2 text-[#4B352A] text-center">No results found.</div>}
          {!isSearching && searchResults.length > 0 && (
            <ul>
              {searchResults.map((recipe) => (
                <li key={recipe.id} className="border-b border-[#CA7842]/30 last:border-b-0">
                  <Link to={`/recipes/${recipe.id}`} className="block px-4 py-2 hover:bg-[#CA7842] hover:text-white rounded-t transition font-medium text-[#4B352A]" onClick={clearSearch}>
                    {recipe.title}
                    {recipe.user && <span className="text-sm text-[#A58D7B] ml-2">by {recipe.user.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar