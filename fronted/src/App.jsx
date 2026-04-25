import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from './routes/AppRoutes.jsx'
import "./App.css";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/auth/authThunks.js";

// Global Loader (important for lazy loading)
const Loader = () => <div className="loader">Loading...</div>;

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  return (
    <>

      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
