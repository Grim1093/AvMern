import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';

function Dashboard({ toggleTheme, theme }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortPref, setSortPref] = useState(localStorage.getItem('sortPref') || 'desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Announcer for screen readers
  const [announcement, setAnnouncement] = useState('');

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Feedback State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem('sortPref', sortPref);
  }, [sortPref]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const announce = (message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks`, {
        params: { search, status: statusFilter, sort: sortPref, page, limit: 5 },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setTotalTasks(response.data.totalTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error.message);
    }
  }, [user, search, statusFilter, sortPref, page]);

  useEffect(() => {
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
      setPage(1); 
      fetchTasks();
      announce('Task added successfully');
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
      announce('Task deleted');
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
      announce(`Task marked as ${newStatus}`);
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
      announce('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error.message);
    }
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    setIsFeedbackModalOpen(false);
    setFeedbackText('');
    announce('Thank you for your feedback!');
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Hidden ARIA Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {announcement}
      </div>

      <div className="dashboard-layout">
        
        {/* SIDEBAR */}
        <div className="dashboard-sidebar">
          
          <div className="dashboard-header glass-panel" style={{ padding: '1.5rem' }}>
            <div>
              <h2 className="title-gradient" style={{ fontSize: '1.5rem' }}>{getGreeting()},<br/>{user.name.split(' ')[0]}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your day effortlessly</p>
            </div>
            <div className="user-info">
              <button 
                className="btn-icon" 
                onClick={toggleTheme} 
                title="Toggle Theme"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
                )}
              </button>
              <div className="user-avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</div>
              <button className="btn-outline" onClick={onLogout} aria-label="Log out of application" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Logout</button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <form onSubmit={onAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Create a Task</h3>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                aria-label="New Task Title"
              />
              <textarea 
                placeholder="Additional notes (optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                aria-label="New Task Description"
                rows="3"
                style={{ resize: 'vertical', minHeight: '60px' }}
              />
              <button type="submit" className="btn-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                Add Task
              </button>
            </form>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button className="btn-outline" onClick={() => setIsFeedbackModalOpen(true)} style={{ fontSize: '0.85rem', width: '100%' }}>
              Give Feedback
            </button>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="dashboard-main">
          
          <div className="controls-bar glass-panel" style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '12px' }}>
            <input 
              type="search" 
              className="search-input"
              placeholder="Search your tasks..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search tasks"
            />
            <Dropdown 
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' }
              ]}
              ariaLabel="Filter by status"
            />
            <Dropdown 
              value={sortPref}
              onChange={(val) => { setSortPref(val); setPage(1); }}
              options={[
                { value: 'desc', label: 'Newest First' },
                { value: 'asc', label: 'Oldest First' }
              ]}
              ariaLabel="Sort tasks"
            />
          </div>

          <div className="task-list-container" role="list">
            {tasks.length === 0 ? (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No tasks found</h3>
                <p>You have {totalTasks} total tasks matching this criteria.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="task-card glass-panel" role="listitem">
                  <div className="task-content">
                    <div className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                      {task.title}
                      <span className={`task-status-badge status-${task.status}`} aria-label={`Status: ${task.status}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                  </div>
                  <div className="task-actions">
                    <button 
                      className={`btn-icon ${task.status === 'completed' ? 'btn-outline' : 'btn-success'}`}
                      onClick={() => onToggleStatus(task)}
                      aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                      title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {task.status === 'completed' ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M12 3l-9 9 9 9"></path></svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                      )}
                    </button>
                    <button 
                      className="btn-icon btn-outline" 
                      onClick={() => openEditModal(task)} 
                      aria-label="Edit task"
                      title="Edit Task"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => onDeleteTask(task._id)} 
                      aria-label="Delete task"
                      title="Delete Task"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination glass-panel" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px' }} aria-label="Pagination Navigation">
              <button 
                className="btn-outline"
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                aria-label="Previous Page"
              >
                Previous
              </button>
              <span className="page-info" aria-live="polite">Page {page} of {totalPages}</span>
              <button 
                className="btn-outline"
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-dialog-title">
            <h2 id="edit-dialog-title" className="title-gradient">Edit Task</h2>
            <form onSubmit={onUpdateTask}>
              <input 
                type="text" 
                placeholder="Task Title..." 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                required
                aria-label="Edit Task Title"
              />
              <textarea 
                placeholder="Description" 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                rows="4"
                aria-label="Edit Task Description"
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="feedback-dialog-title">
            <h2 id="feedback-dialog-title" className="title-gradient">Send Feedback</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Help us iterate and improve the UI/UX!</p>
            <form onSubmit={submitFeedback}>
              <textarea 
                placeholder="What do you think of the app?" 
                value={feedbackText} 
                onChange={(e) => setFeedbackText(e.target.value)} 
                rows="5"
                required
                aria-label="Feedback Text"
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsFeedbackModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;