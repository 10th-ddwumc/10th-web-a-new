import { Link, Route, Routes } from "./router";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const Header = () => {
  return (
    <nav style={{ display: "flex", gap: "15px" }}>
      <Link to="/">HOME</Link>
      <Link to="/about">ABOUT</Link>
      <Link to="/profile">PROFILE</Link>
      <Link to="/random">RANDOM</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/profile" component={Profile} />
        <Route path="/random" component={NotFound} />
      </Routes>
    </>
  );
}

export default App;
