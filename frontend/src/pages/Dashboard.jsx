import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  // Retrieve user token from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log('[Dashboard Step 1] Component mounted. Checking authentication...');
    if (!user) {
      console.log('[Dashboard Warning] No user found. Redirecting to login.');
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    console.log('[Dashboard Step 2] Fetching tasks from backend...');
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(`[Dashboard Success] Fetched ${response.data.length} tasks.`);
      setTasks(response.data);
    } catch (error) {
      console.error('[Dashboard Error] Failed to fetch tasks:', error.message);
    }
  };

  const onAddTask = async (e) => {
    e.preventDefault();
    console.log('[Dashboard Step 3] Adding new task...');
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', { title }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('[Dashboard Success] Task added successfully.');
      setTasks([...tasks, response.data]);
      setTitle('');
    } catch (error) {
      console.error('[Dashboard Error] Failed to add task:', error.message);
    }
  };

  const onDeleteTask = async (id) => {
    console.log(`[Dashboard Step 4] Deleting task ${id}...`);
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('[Dashboard Success] Task deleted.');
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('[Dashboard Error] Failed to delete task:', error.message);
    }
  };

  const onLogout = () => {
    console.log('[Dashboard] Logging out user...');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      {console.log('[UI] Rendering Dashboard Component')}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={onAddTask} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="New Task Title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ flexGrow: 1 }}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '30px' }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span>{task.title}</span>
            <button onClick={() => onDeleteTask(task._id)} style={{ color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;