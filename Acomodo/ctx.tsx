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
import NewGuest from "./components/api/NewGuest";
import { FirebaseError } from "firebase/app";

// Type for authentication context
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

// Initial state for authentication context
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

// Function for accessing the authentication context
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

// Component that will wrap entire app, allowing access to authentication
export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = React.useState<User | null>(auth.currentUser);
  const [initializing, setInitializing] = React.useState(true);
  const backendWaitingRef = React.useRef(false);

  React.useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (!backendWaitingRef.current) {
        setSession(user);
        if (initializing) setInitializing(false);
      }
    });
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // Sign up function
        signUp: async (
          email: string,
          password: string,
          displayName: string,
          documentNr: string,
          dateOfBirth: Date
        ) => {
          try {
            // Create the new user and get their id token
            backendWaitingRef.current = true;
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            await updateProfile(user, { displayName: displayName });
            const token = await user?.getIdToken(true);

            // Send the token and details to the PHP script
            const code = await NewGuest({
              token: token,
              guestName: displayName,
              guestDoB: dateOfBirth.getTime(),
              guestDocNr: documentNr,
              email: email,
            });

            backendWaitingRef.current = false;

            console.log(code);

            // If an error occurs, abort
            if (code != 200) {
              await deleteUser(user);
              return "backendError";
            }

            setSession(user);
            return true;
          } catch (e) {
            if (e instanceof FirebaseError) {
              // Handle errors
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
              return errorCode;
            }

            return false;
          }
        },
        // Sign in function
        signIn: async (email: string, password: string) => {
          try {
            // Attempt to authenticate the user
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            // If successful, set current user to the user that signed in
            setSession(user);
            return true;
          } catch (e) {
            // Handle errors
            if (e instanceof FirebaseError) {
              const errorCode = e.code;
              const errorMessage = e.message;
              console.log(errorCode, errorMessage);
              return errorCode;
            }
            return false;
          }
        },
        // Sign out function
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
