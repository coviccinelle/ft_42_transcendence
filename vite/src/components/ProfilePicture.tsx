interface ProfilePictureProps {
    src: string;
}

function ProfilePicture(props: ProfilePictureProps): JSX.Element {
    return (
        <img className="w-24 h-24 rounded-full" src={props.src} />
        //object-cover
    );
}

export default ProfilePicture;