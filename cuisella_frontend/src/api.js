import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
if (token) api.defaults.headers.common['X-CSRF-TOKEN'] = token

export const login = credentials => api.post('/login', credentials)
export const register = data => api.post('/register', data)
export const fetchUser = () => api.get('/user')
export const logout = () => api.post('/logout')
export const addRecipe = recipeData => api.post('/recipes', recipeData)
export const getMyRecipes = () => api.get('/my-recipes')
export const getFavorites = () => api.get('/favorites')


export default api
