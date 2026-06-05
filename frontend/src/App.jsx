import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';

// Lazy load the pages for code-splitting and performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// A minimalist loading fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
    <div aria-live="polite">Loading...</div>
  </div>
);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    console.log('[App Component] Application successfully mounted. Routing ready.');
  }, []);

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login toggleTheme={toggleTheme} theme={theme} />} />
            <Route path="/register" element={<Register toggleTheme={toggleTheme} theme={theme} />} />
            <Route path="/dashboard" element={<Dashboard toggleTheme={toggleTheme} theme={theme} />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;