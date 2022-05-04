import {
  ReactNode,
  useContext,
  useEffect,
  createContext,
  useState,
} from 'react';
import { initializeApp } from 'firebase/app';
import Firebase, {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as _signOut,
} from 'firebase/auth';
import User from '../models/user';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: 'todolist-89bb8.firebaseapp.com',
  projectId: 'todolist-89bb8',
  storageBucket: 'todolist-89bb8.appspot.com',
  messagingSenderId: '71693804254',
  appId: '1:71693804254:web:3605987dd8b1178253584f',
  measurementId: 'G-GVWTC8F2CH',
};

const app = initializeApp(firebaseConfig);

interface AuthState {
  user?: User | null;
}

interface AuthContextType {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({});

  async function signIn(email: string, password: string) {
    const firebaseAuth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      setAuth({ user: convUser(userCredential.user) });
    } catch (err) {
      // TODO: エラーハンドリング
    }
  }

  async function signOut() {
    const firebaseAuth = getAuth();
    try {
      await _signOut(firebaseAuth);
      setAuth({ user: undefined });
    } catch (err) {
      // TODO: エラーハンドリング
    }
  }

  useEffect(() => {
    const firebaseAuth = getAuth();
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth({ user: convUser(user) });
      } else {
        setAuth({ user: null });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function convUser(_user: Firebase.UserInfo): User {
  const user: User = {
    name: _user.displayName ?? 'ユーザー',
    email: _user.email ?? '',
  };
  return user;
}