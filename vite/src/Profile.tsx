import axios, { AxiosError, AxiosResponse } from 'axios';
import { domainName } from './main';

function Profile() {
  function getPicture(): string {
    let pictureUrl: string = '';
    console.log("getpicture")
    axios.get(`http://${domainName}/api/auth/status`)
    .then((response) => {
      console.log(response.data);
      console.log(response.data.user.picture);
      pictureUrl = response.data.user.picture;
    })
    .catch((error) => {
      console.log(error);
      // TODO: redirect to login page if not authenticated
      // TODO: random image if no picture
    });
    return pictureUrl;
  }
  const imageSrc: string = getPicture();
  console.log(imageSrc);

  return (
    <div>
      <img src={imageSrc}></img>
    </div>
  );
}

export default Profile;
