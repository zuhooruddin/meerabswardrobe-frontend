import axios from 'axios'
import { useRouter } from 'next/router';


export default async (req, res) => {
  const router = useRouter();
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  let accessToken = null;

  if (req.method === 'POST') {
    const {username, email, password} = req.body

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

    try {
      await axios.post(server_ip+'registerUser', body, config)
    } catch(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        
        return res.status(401).json({message: error.response.data.detail})
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
      } else {
        // Something happened in setting up the request that triggered an Error
      }

      return res.status(500).json({message: 'Something went wrong'})
    }
    res.status(200).json({message: "User has been created"})
    router.push('/')
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({message: `Method ${req.method} is not allowed`})
  }
}