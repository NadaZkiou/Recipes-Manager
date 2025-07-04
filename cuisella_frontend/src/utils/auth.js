export const setAuthToken = token => {
  localStorage.setItem('auth_token', token)
}

export const getAuthToken = () => localStorage.getItem('auth_token')

export const removeAuthToken = () => localStorage.removeItem('auth_token')

export const checkAuth = async () => {
  try {
    await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' })
    const token = getAuthToken()
    if (!token) return null
    const response = await fetch('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      credentials: 'include'
    })
    if (!response.ok) {
      removeAuthToken()
      return null
    }
    return await response.json()
  } catch {
    removeAuthToken()
    return null
  }
}
