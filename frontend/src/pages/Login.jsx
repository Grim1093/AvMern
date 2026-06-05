import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login Step 1] Login form submitted.');

    try {
      console.log('[Login Step 2] Sending POST request to backend verify credentials...');
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      console.log('[Login Success] Credentials verified! Saving token to localStorage...');
      localStorage.setItem('user', JSON.stringify(response.data));
      
      console.log('[Login Step 3] Redirecting to Dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('[Login Error] Failed to login:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      {console.log('[UI] Rendering Login Component')}
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" name="email" placeholder="Email Address" onChange={onChange} />
        <input type="password" name="password" placeholder="Password" onChange={onChange} />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;