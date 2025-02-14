import "./App.css";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./components/routes/AllRoutes";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const BASE_URL = import.meta.env.VITE_GOOGLE_AUTH_KEY;
  const persisted = persistStore(store);
  return (
    <GoogleOAuthProvider clientId={BASE_URL}>
      <Provider store={store}>
        <PersistGate persistor={persisted}>
          <ToastContainer />
          <BrowserRouter >
            <AllRoutes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
