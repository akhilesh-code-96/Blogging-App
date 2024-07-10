import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Blog from "./Blog.jsx";
import Header from "./components/Header.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Profile from "./Profile.jsx";

function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Blog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
