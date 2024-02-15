import React from "react";
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
  deleteUser,
} from "firebase/auth";
import NewGuest from "./components/NewGuest";

interface AuthContextProps {
  signUp: (
    email: string,
    password: string,
    displayName: string,
    documentNr: string,
    dateOfBirth: Date
  ) => void;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: User | null;
}

// ???
const AuthContext = React.createContext<AuthContextProps>({
  signUp: (
    email: string,
    password: string,
    displayName: string,
    documentNr: string,
    dateOfBirth: Date
  ) => {},
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
        signUp: (
          email: string,
          password: string,
          displayName: string,
          documentNr: string,
          dateOfBirth: Date
        ) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              updateProfile(user, { displayName: displayName });
              user?.getIdToken(true).then((token) =>
                NewGuest({
                  token: token,
                  guestName: displayName,
                  guestDoB: dateOfBirth.getTime(),
                  guestDocNr: documentNr,
                  email: email,
                }).then((code) => {
                  console.log(code);
                  if (code != 200) {
                    deleteUser(user);
                    return false;
                  }
                  return true;
                })
              );

              setSession(user);
            })
            .catch((e) => {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
              return false;
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
