import axios from 'axios';
import { domainName } from 'src/main';

export async function getTokenFt(code: string): Promise<any> {
  const client_secret = process.env.FT_CLIENT_SECRET;
  const client_id = process.env.FT_CLIENT_ID;
  const redirect_uri = `http://${domainName}/api/auth/ft/callback`;
  const data = {
    grant_type: 'authorization_code',
    code: code,
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_uri,
  };

  console.log('Posting to oauth/token...');
  try {
    const response = await axios.post(
      'https://api.intra.42.fr/oauth/token',
      data,
    );
    return response.data;
  } catch (e) {
    throw new Error("Erreur lors de l'authentification : " + e.message);
  }
}

export async function getProfileFt(token: string): Promise<any> {
  // !! 2 requests par secondes
  const auth_value = 'Bearer ' + token;

  console.log('Getting profile from api...');
  try {
    const profileResponse = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: auth_value },
    });
    return profileResponse.data;
  } catch (error) {
    throw new Error(
      'Erreur lors de la requete GET /v2/me (getProfileFt()) : ' +
        error.message,
    );
  }
}
