import React, { useState } from "react";
import { auth, googleProvider, facebookProvider, signInWithPopup, signOut } from "../firebaseConfig";
import { User } from "firebase/auth"; // ✅ Import User type

const LoginPage = () => {
    const [user, setUser] = useState<User | null>(null); // ✅ Explicitly type the state

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user); // ✅ No more type errors
        } catch (error) {
            console.error("Google login failed", error);
        }
    };

    const signInWithFacebook = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            setUser(result.user); // ✅ No more type errors
        } catch (error) {
            console.error("Facebook login failed", error);
        }
    };

    return (
        <div>
            {user ? (
                <>
                    <h2>Welcome, {user.displayName ?? "User"}</h2> {/* ✅ Fix potential null value */}
                    <button onClick={() => signOut(auth).then(() => setUser(null))}>Log Out</button>
                </>
            ) : (
                <>
                    <button onClick={signInWithGoogle}>Login with Google</button>
                    <button onClick={signInWithFacebook}>Login with Facebook</button>
                </>
            )}
        </div>
    );
};

export default LoginPage;
