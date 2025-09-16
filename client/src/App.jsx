
// import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Blog from "./components/Blog";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            Route
            path="/"
            element={
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h1>Welcome on our Blog</h1>
                <h3>Login and Register Page</h3>
                <Login></Login>
                <Register></Register>
              </div>
            }
          ></Route>
           <Route path="/blog" element={<Blog />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
