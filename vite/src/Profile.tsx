import axios, { AxiosError, AxiosResponse } from 'axios';
import { domainName } from './main';

function Profile() {
  const getPicture = (): string => {
    let pictureUrl: string = '';

    axios.get(`http://${domainName}/api/profile`)
    .then((response) => {
      console.log(response.data.picture);
      pictureUrl = response.data.picture;
    })
    .catch((error) => {
      console.log(error);
      // TODO: redirect to login page if not authenticated
      // TODO: random image if no picture
    });
    return pictureUrl;
  }
  const imageSrc: string = getPicture();

  return (
    <div>
      <img src={imageSrc}></img>
    </div>
  );
}

export default Profile;
