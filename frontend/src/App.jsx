import { BrowserRouter as Router } from "react-router-dom";
import AllProviders from "./providers/AllProviders";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <AllProviders>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
        />
      </AllProviders>
    </Router>
  );
};

export default App;
