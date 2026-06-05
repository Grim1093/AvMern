import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('[Register Step 1] Form submitted. Validating input...');
    
    if (!formData.name || !formData.email || !formData.password) {
        console.error('[Register Error] Missing fields.');
        return alert('Please fill in all fields');
    }

    try {
      console.log('[Register Step 2] Sending POST request to backend...');
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      
      console.log('[Register Success] User registered! Saving token to localStorage...');
      localStorage.setItem('user', JSON.stringify(response.data));
      
      console.log('[Register Step 3] Redirecting to Dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('[Register Error] Failed to register:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      {console.log('[UI] Rendering Register Component')}
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="name" placeholder="Full Name" onChange={onChange} />
        <input type="email" name="email" placeholder="Email Address" onChange={onChange} />
        <input type="password" name="password" placeholder="Password" onChange={onChange} />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

export default Register;