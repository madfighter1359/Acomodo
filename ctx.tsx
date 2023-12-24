import React from "react";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";

interface AuthContextProps {
  signUp: (email: string, password: string, displayName?: string) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: User | null;
}

const AuthContext = React.createContext<AuthContextProps>({
  signUp: (email: string, password: string) => {},
  signIn: (email: string, password: string) => {},
  signOut: () => {},
  session: null,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = React.useState<User | null>(auth.currentUser);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp: (email: string, password: string, displayName?: string) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              if (displayName) {
                updateProfile(user, { displayName: displayName });
              }
              setSession(user);
            })
            .catch((e) => {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
            });
        },
        signIn: (email: string, password: string) => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              setSession(user);
            })
            .catch((e) => {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
            });
        },
        signOut: () => {
          auth.signOut();
          setSession(null);
        },
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
