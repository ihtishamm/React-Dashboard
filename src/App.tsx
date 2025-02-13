import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from './store/authSlice';
import { auth } from './firebaseConfig';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';
import SignIn from './pages/AuthPages/SignIn';
import SignUp from './pages/AuthPages/SignUp';
import Ecommerce from './pages/Dashboard/ECommerce';
import NotFound from './pages/OtherPage/NotFound';
import BasicTables from './pages/Tables/BasicTables';
import UserProfiles from './pages/UserProfiles';
import ProtectedRoute from './layout/ProtectedRoutes';
import Project from './pages/Project';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeOnAuthStateChanged = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
        try {
          await auth.currentUser!.getIdToken(true);
        } catch (error) {
          console.log(error);
        }
      } else {
        dispatch(setUser(null));
      }
    });

    const unsubscribeOnIdTokenChanged = auth.onIdTokenChanged(async (user) => {
      const localIdToken = localStorage.getItem('idToken');
      if (user) {
        const idToken = await user.getIdToken();
        if (idToken !== localIdToken) {
          console.log('User Token Refreshed');
          localStorage.setItem('idToken', idToken);
        }
      }
    });

    return () => {
      unsubscribeOnAuthStateChanged();
      unsubscribeOnIdTokenChanged();
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index path="/" element={<Ecommerce />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/project" element={<Project />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;