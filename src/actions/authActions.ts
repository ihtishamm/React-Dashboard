
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, updateProfile} from 'firebase/auth';
import { setUser, setLoading, setError } from '../store/authSlice';
import {AppDispatch} from '../store/store';


export const loginWithEmail = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredential.user));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerWithEmail = (firstName: string, lastName: string, email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const displayName = `${firstName} ${lastName}`;

    await updateProfile(user, { displayName });

    dispatch(setUser({ ...user, displayName }));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await signInWithPopup(auth, googleProvider);
    dispatch(setUser(result.user));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
    localStorage.removeItem('idToken');
    dispatch(setUser(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};