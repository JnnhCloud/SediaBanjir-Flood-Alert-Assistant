// src/pages/Index.tsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import SignInButton from "../components/SignInButton";
import IndexContent from "./IndexContent";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h1>Please sign in to continue</h1>
        <SignInButton />
      </div>
    );
  }

  // Pass user as a prop
  return <IndexContent user={user} />;
}