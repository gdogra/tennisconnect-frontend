import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [page, setPage] = useState('landing');

  const renderPage = () => {
    switch (page) {
      case 'login': return <Login navigate={setPage} />;
      case 'register': return <Register navigate={setPage} />;
      case 'dashboard': return <Dashboard navigate={setPage} />;
      default: return <LandingPage navigate={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;

