import axios from 'axios';

export async function getProfileFt(token: string): Promise<any> {
  // !! 2 requests par secondes
  const auth_value = 'Bearer ' + token;

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
