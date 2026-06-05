import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown';

function Dashboard({ toggleTheme, theme }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortPref, setSortPref] = useState(localStorage.getItem('sortPref') || 'desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Announcer for screen readers
  const [announcement, setAnnouncement] = useState('');

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState('Work');
  const [editDueDate, setEditDueDate] = useState('');

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsEditModalOpen(false);
        setIsFeedbackModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        params: { search, status: statusFilter, tag: tagFilter, sort: sortPref, page, limit: 5 },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
      setTotalTasks(response.data.totalTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error.message);
    }
  }, [user, search, statusFilter, tagFilter, sortPref, page]);

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
      await axios.post('http://localhost:5000/api/tasks', { 
        title, 
        description,
        tag,
        dueDate: dueDate || null
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTitle('');
      setDescription('');
      setTag('Work');
      setDueDate('');
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
    setEditTag(task.tag || 'Other');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsEditModalOpen(true);
  };

  const onUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, 
        { 
          title: editTitle, 
          description: editDescription,
          tag: editTag,
          dueDate: editDueDate || null
        }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsEditModalOpen(false);
      fetchTasks();
      announce('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error.message);
    } finally {
      setIsSaving(false);
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

  // Gamification Metrics
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressRatio = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Visual Urgency Logic
  const getUrgencyClass = (task) => {
    if (task.status === 'completed' || !task.dueDate) return '';
    const now = new Date();
    const due = new Date(task.dueDate);
    now.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    
    if (due < now) return 'task-overdue'; // Past due
    if (due.getTime() === now.getTime()) return 'task-due-soon'; // Due today
    return '';
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
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Manage your day effortlessly</p>
              
              {/* Gamification Progress Bar */}
              <div className="progress-container" aria-label={`Progress: ${Math.round(progressRatio)}%`}>
                <div className="progress-fill" style={{ width: `${progressRatio}%` }}></div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textAlign: 'right' }}>
                {completedCount} of {tasks.length} completed
              </p>
            </div>
            
            <div className="user-info" style={{ marginTop: '0.5rem' }}>
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
                rows="2"
                style={{ resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Dropdown 
                    value={tag}
                    onChange={(val) => setTag(val)}
                    options={[
                      { value: 'Work', label: 'Work' },
                      { value: 'Personal', label: 'Personal' },
                      { value: 'Urgent', label: 'Urgent' },
                      { value: 'Other', label: 'Other' }
                    ]}
                    ariaLabel="Select Tag"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    aria-label="Due Date"
                    style={{ width: '100%', padding: '0.75rem 0.5rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
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
              value={tagFilter}
              onChange={(val) => { setTagFilter(val); setPage(1); }}
              options={[
                { value: 'all', label: 'All Tags' },
                { value: 'Work', label: 'Work' },
                { value: 'Personal', label: 'Personal' },
                { value: 'Urgent', label: 'Urgent' },
                { value: 'Other', label: 'Other' }
              ]}
              ariaLabel="Filter by tag"
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
              <div className="empty-state" style={{ margin: 'auto', animation: 'fadeIn 0.5s ease-out' }}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8, marginBottom: '1rem' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>You're all caught up!</h3>
                <p>Time to relax, or create a new task.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className={`task-card glass-panel task-card-enter card-tag-${(task.tag || 'other').toLowerCase()} ${getUrgencyClass(task)}`} role="listitem">
                  <div className={`task-content ${task.status === 'completed' ? 'completed' : ''}`}>
                    <div className="task-title">
                      <span className="task-title-text">{task.title}</span>
                      <span className={`task-tag tag-${(task.tag || 'other').toLowerCase()}`}>{task.tag || 'Other'}</span>
                      {task.dueDate && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
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
                rows="3"
                aria-label="Edit Task Description"
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Dropdown 
                    value={editTag}
                    onChange={(val) => setEditTag(val)}
                    options={[
                      { value: 'Work', label: 'Work' },
                      { value: 'Personal', label: 'Personal' },
                      { value: 'Urgent', label: 'Urgent' },
                      { value: 'Other', label: 'Other' }
                    ]}
                    ariaLabel="Edit Tag"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input 
                    type="date" 
                    value={editDueDate} 
                    onChange={(e) => setEditDueDate(e.target.value)} 
                    aria-label="Edit Due Date"
                    style={{ width: '100%', padding: '0.75rem 1rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
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