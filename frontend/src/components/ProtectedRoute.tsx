// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please sign in to access the dashboard.</p>;

  return <>{children}</>;
}