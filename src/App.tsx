import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { auth, firebase } from 'services/firebase';

import Routes from './routes';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextData = {
  user?: User;
  signInWithGoogle: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextData>(
  {} as AuthContextData
);

function App() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const unsubscribeToAuthStateChange = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing informtion from Google account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribeToAuthStateChange();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing informtion from Google account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <Router>
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        <Routes />
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
