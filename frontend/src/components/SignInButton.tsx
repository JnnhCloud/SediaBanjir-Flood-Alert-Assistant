// src/components/SignInButton.tsx
import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null);

  // Track auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User info:", result.user);
    } catch (error) {
      console.error("Login error", error);
      alert("Failed to sign in");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Logged out");
    } catch (error) {
      console.error("Logout error", error);
      alert("Failed to sign out");
    }
  };

  return (
    <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: 10 }}>
      {user ? (
        <>
          <span>Hi, {user.displayName}</span>
          <button
            onClick={handleSignOut}
            style={{
              padding: "8px 12px",
              backgroundColor: "#d32f2f",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={handleSignIn}
          style={{
            padding: "8px 12px",
            backgroundColor: "#081D93",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}