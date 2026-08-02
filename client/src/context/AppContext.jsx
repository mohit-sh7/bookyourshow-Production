import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // SEND cookies with requests

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  

  // -------------------------
  // STATE
  // -------------------------
  const [user, setUser] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // -------------------------
  // LOAD USER FROM COOKIE
  // -------------------------
  const loadUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/profile");

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // -------------------------
  // LOGOUT HANDLER
  // -------------------------
  const logoutUser = async () => {
    try {
      await axios.post(
    "/api/auth/logout",
    {},
    {
        withCredentials: true,
    }
);
      setUser(null);
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  // -------------------------
  // FETCH SHOWS
  // -------------------------
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) setShows(data.shows);
    } catch (err) {
      toast.error("Failed to load movies");
    }
  };

  // -------------------------
  // FETCH FAVORITES
  // -------------------------
  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites");

      if (data.success) setFavoriteMovies(data.movies);
    } catch (err) {
      console.log("Favorites load skipped (not logged in)");
    }
  };

  // -------------------------
  // CHECK ADMIN
  // -------------------------
  const fetchIsAdmin = async () => {
  try {
    const { data } = await axios.get("/api/admin/is-admin");

    if (data.success) {
      setIsAdmin(data.isAdmin);
    } else {
      setIsAdmin(false);
    }
  } catch (error) {
    setIsAdmin(false);
  } finally {
    setIsAdminLoading(false);
  }
};

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  useEffect(() => {
    Promise.all([loadUser(), fetchShows()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // -------------------------
  // RUN when USER changes
  // -------------------------
  useEffect(() => {
  if (user) {
    fetchFavoriteMovies();
    fetchIsAdmin();
  } else {
    setIsAdmin(false);
    setIsAdminLoading(false);
  }
}, [user]);
  return (
 <AppContext.Provider
  value={{
    axios,
    user,
    shows,
    loading,
    isAdmin,
    isAdminLoading,
    favoriteMovies,
    fetchFavoriteMovies,
    fetchIsAdmin,
    logoutUser,
    loadUser,
    image_base_url,
    navigate,
  }}
>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
