import axios from 'axios';
import GoogleProvider from "next-auth/providers/google";

async function fetchGoogleCredentials() {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'getGeneralSetting');
    const data = response.data[0];
    return {
      googleClientId: data.googleid,
      googleClientSecret: data.googlesecret,
    };
  } catch (error) {
    throw new Error('Error fetching Google credentials from API.');
  }
}

function getGoogleProvider() {
  return fetchGoogleCredentials().then((credentials) => {
    console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",credentials)
    return GoogleProvider({
      clientId: credentials.googleClientId,
      clientSecret: credentials.googleClientSecret,
    });
  });
}

export { getGoogleProvider };
