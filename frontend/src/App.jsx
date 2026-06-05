import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  useEffect(() => {
    console.log('[App Component] Application successfully mounted. Routing ready.');
  }, []);

  return (
    <Router>
      <div className="App">
        {console.log('[Router] Evaluating URL path...')}
        <Routes>
          {/* Redirect the root path directly to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;