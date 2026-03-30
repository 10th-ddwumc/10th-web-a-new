import './App.css';
import { Link, Route, Routes } from './router';

const duduPage = () => <h1>두두 페이지</h1>;
const manduPage = () => <h1>만두 페이지</h1>;
const JoyPage = () => <h1>야옹 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => (
  <nav style={{ display: 'flex', gap: '10px' }}>
    <Link to='/dudu'>DUDU</Link>
    <Link to='/mandu'>만두</Link>
    <Link to='/joy'>JOY</Link>
    <Link to='/not-found'>NOT FOUND</Link>
  </nav>
);

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/dudu' component={duduPage} />
        <Route path='/mandu' component={manduPage} />
        <Route path='/joy' component={JoyPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;