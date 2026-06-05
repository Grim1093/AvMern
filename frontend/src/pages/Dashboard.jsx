import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks`, {
        params: { search, status: statusFilter, page, limit: 5 },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setTotalTasks(response.data.totalTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error.message);
    }
  }, [user, search, statusFilter, page]);

  useEffect(() => {
    // Add a slight delay for search input to prevent excessive API calls
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchTasks]);

  const onAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/tasks', { title, description }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTitle('');
      setDescription('');
      setPage(1); // Reset to page 1 to see new task
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error.message);
    }
  };

  const onDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error.message);
    }
  };

  const onToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task status:', error.message);
    }
  };

  const openEditModal = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditModalOpen(true);
  };

  const onUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, 
        { title: editTitle, description: editDescription }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsEditModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error.message);
    }
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div>
          <h2 className="title-gradient">Task Master</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your day effectively</p>
        </div>
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <button className="btn-outline" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={onAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Add New Task</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Task Title..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              style={{ flexGrow: 1 }}
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ flexGrow: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>Add Task</button>
          </div>
        </form>
      </div>

      <div className="controls-bar">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search tasks..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select 
          className="filter-select"
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-panel empty-state">
          <h3>No tasks found</h3>
          <p>You have {totalTasks} total tasks matching this criteria.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card glass-panel">
              <div className="task-content">
                <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                  {task.title}
                  <span className={`task-status-badge status-${task.status}`}>
                    {task.status}
                  </span>
                </div>
                {task.description && <div className="task-desc">{task.description}</div>}
              </div>
              <div className="task-actions">
                <button 
                  className={task.status === 'completed' ? 'btn-outline' : 'btn-success'}
                  onClick={() => onToggleStatus(task)}
                >
                  {task.status === 'completed' ? 'Undo' : 'Complete'}
                </button>
                <button className="btn-outline" onClick={() => openEditModal(task)}>Edit</button>
                <button className="btn-danger" onClick={() => onDeleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn-outline"
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button 
            className="btn-outline"
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="title-gradient">Edit Task</h2>
            <form onSubmit={onUpdateTask}>
              <input 
                type="text" 
                placeholder="Task Title..." 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                required
              />
              <textarea 
                placeholder="Description" 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                rows="4"
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;