import ProfilePicture from "./ProfilePicture";

interface ProfileProps {
    firstName: string;
    lastName: string;
    email: string;
    src: string;
}

function Profile(props: ProfileProps): JSX.Element {
    return (
        <div className="flex flex-col items-center">
            <ProfilePicture src={props.src} />
            <div className="text-2xl font-bold">{props.firstName} {props.lastName}</div>
            <div className="text-xl">{props.email}</div>
        </div>
    );
}

export default Profile;