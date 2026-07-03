import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import UserMain from "./pages/UserMain";
import { Provider } from "react-redux";
import { store } from "./app/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<UserMain />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
