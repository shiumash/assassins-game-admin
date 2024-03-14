import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login';
import Home from './pages/home';

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} /> 
          <Route exact path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
