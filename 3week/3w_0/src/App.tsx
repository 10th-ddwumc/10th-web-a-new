import './index.css';
import { Link, Route, Routes } from './router';

const HomePage = () => <h1>홈 페이지</h1>;
const AboutPage = () => <h1>소개 페이지</h1>;
const ProfilePage = () => <h1>프로필 페이지</h1>;
const NotFoundPage = () => <h1>404 페이지</h1>;

const Header = () => {
  return (
    <nav className="nav">
      <Link to="/">HOME</Link>
      <Link to="/about">ABOUT</Link>
      <Link to="/profile">PROFILE</Link>
      <Link to="/not-found">NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/not-found" component={NotFoundPage} />
        </Routes>
      </main>
    </div>
  );
}

export default App;