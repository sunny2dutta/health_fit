import { GoogleLogin } from '@react-oauth/google';

interface GoogleSignInButtonProps {
    onSuccess: (credential: string) => void;
    onError: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError }) => {
    return (
        <div className="w-full flex justify-center my-4">
            <GoogleLogin
                onSuccess={credentialResponse => {
                    if (credentialResponse.credential) {
                        onSuccess(credentialResponse.credential);
                    } else {
                        onError();
                    }
                }}
                onError={() => {
                    console.log('Login Failed');
                    onError();
                }}
                useOneTap
            />
        </div>
    );
};
