import axios from 'axios'

// import { getSession } from "next-auth/react"
import { useSession, getSession } from "next-auth/react"
// import { authOptions } from "./auth/[...nextauth]"

const signoutCallbackUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'api/auth/logout/';
process.env.NEXTAUTH_SITE = "http://chitralhive.com/api"
export default  function handler (req, res){
   ("request in logout")
  // const session =   getSession({req});
  // const { data: session, status } = useSession({req});
  // const session = await unstable_getServerSession(req, res, authOptions)
//   (data,status);

  // // const { data: session, status } = useSession()
  // const session = await getSession({req})
  // // const session = await unstable_getServerSession(req, res, authOptions)
  // if (session) {
  //   // Signed in
  //    ("logout Session")
  //    ("session token: ", session.token.user)

  // } 
  // return res.status(200).json({message: 'Logged out returned'})
  // const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  // if(session){


  //   if (req.method === 'POST') {
  //     const {username} = req.body

  //     const config = {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //     const body = {
  //       username
  //     }
  //     try {
  //       await axios.post(server_ip+'api/auth/logout/', body, config)
  //     } catch(error) {
  //       if (error.response) {
  //         // The request was made and the server responded with a status code
  //         // that falls out of the range of 2xx
  //         console.error(error.response.data);
  //         console.error(error.response.status);
  //         console.error(error.response.headers);
  //         return res.status(401).json({message: error.response.data.detail})
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //         // http.ClientRequest in node.js
  //         console.error(error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.error('Error', error.message);
  //       }
  //       console.error(error.config);

  //       return res.status(500).json({message: 'Something went wrong. Try again'})
  //     }
  //     res.status(200).json({message: "User has been logged out"})
  //     router.push('/')
  //   } else {
  //     res.setHeader('Allow', ['POST'])
  //     res.status(405).json({message: `Method ${req.method} is not allowed`})
  // }
  // }
}
