import { createContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [accessToken, setAccessToken] = useState(null)
	const [error, setError] = useState(null)

	const router = useRouter()

	// Login User


	const register = async ({ username, email, password }) => {
		const config = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}

		const body = {
			username,
			email,
			password
		}

		
			// call nextjs api function to create a user
			await axios.post('https://chitralhive.com/api/registerUser', body, config)
		
		
	}

	return (
		<AuthenticationContext.Provider value={{ user, accessToken, error, register }}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export default AuthenticationContext
