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
import { FirebaseError } from "firebase/app";

interface AuthContextProps {
  signUp: (
    email: string,
    password: string,
    displayName: string,
    documentNr: string,
    dateOfBirth: Date
  ) => Promise<boolean | string>;
  signIn: (email: string, password: string) => Promise<boolean | string>;
  signOut: () => void;
  session?: User | null;
}

// ???
const AuthContext = React.createContext<AuthContextProps>({
  signUp: async (
    email: string,
    password: string,
    displayName: string,
    documentNr: string,
    dateOfBirth: Date
  ) => false,
  signIn: async (email: string, password: string) => false,
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
        signUp: async (
          email: string,
          password: string,
          displayName: string,
          documentNr: string,
          dateOfBirth: Date
        ) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            await updateProfile(user, { displayName: displayName });
            const token = await user?.getIdToken(true);
            const code = await NewGuest({
              token: token,
              guestName: displayName,
              guestDoB: dateOfBirth.getTime(),
              guestDocNr: documentNr,
              email: email,
            });

            console.log(code);
            if (code != 200) {
              deleteUser(user);
              return "backendError";
            }
            setSession(user);
            return true;
          } catch (e) {
            if (e instanceof FirebaseError) {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
              return errorCode;
            }

            return false;
          }
        },
        signIn: async (email: string, password: string) => {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            setSession(user);
            return true;
          } catch (e) {
            if (e instanceof FirebaseError) {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
              return errorCode;
            }
            return false;
          }
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
