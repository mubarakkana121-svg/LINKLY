import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, getAllUsers, deleteUser, getAllFiles, deleteAdminFile } from '../services/adminService';
import Navbar from '../components/Navbar';

function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [tab, setTab] = useState('users');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [statsData, usersData, filesData] = await Promise.all([
        getStats(),
        getAllUsers(),
        getAllFiles(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setFiles(filesData);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You do not have access to this page.');
      } else if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Something went wrong loading the admin dashboard.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and all their files?')) return;
    await deleteUser(userId);
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file?')) return;
    await deleteAdminFile(fileId);
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="page-center">
          <div className="glass-card auth-card" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '20px' }}>🚫 {error}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="app-shell">
        <div className="page-heading">
          <div><p className="eyebrow">System control center</p><h1>Admin <span className="gradient-text">overview.</span></h1><p>Monitor content, users, storage, and workspace health from one place.</p></div>
          <button className="secondary" onClick={loadAll}>↻ Refresh data</button>
        </div>

        {/* KPI cards */}
        <div className="metric-grid">
          <div className="metric">
            <small>Registered users</small><strong>{stats ? stats.total_users : '—'}</strong><span>● Platform access</span>
          </div>
          <div className="metric">
            <small>Stored files</small><strong>{stats ? stats.total_files : '—'}</strong><span>↗ Library health</span>
          </div>
          <div className="metric">
            <small>Downloads</small><strong>{stats ? stats.total_downloads : '—'}</strong><span>↗ Engagement</span>
          </div>
          <div className="metric">
            <small>Private storage</small><strong>{stats ? formatBytes(stats.storage_used) : '—'}</strong><span>● Protected uploads</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="glass-card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            className={tab === 'users' ? '' : 'secondary'}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            className={tab === 'files' ? '' : 'secondary'}
            onClick={() => setTab('files')}
          >
            Files
          </button>
        </div>
        <div className="toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${tab} by name, email, or filename…`} /></div>

        {tab === 'users' && (
          <div className="table-wrap">
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Files</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(query.toLowerCase())).map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.files_count}</td>
                    <td>
                      <button className="danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'files' && (
          <div className="table-wrap">
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>All Files</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Size</th>
                  <th>Downloads</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.filter((f) => `${f.original_name} ${f.user?.name || ''}`.toLowerCase().includes(query.toLowerCase())).map((f) => (
                  <tr key={f.id}>
                    <td>{f.original_name}</td>
                    <td>{f.user ? f.user.name : 'Unknown'}</td>
                    <td>{formatBytes(f.file_size)}</td>
                    <td>{f.downloads}</td>
                    <td>
                      <button className="danger" onClick={() => handleDeleteFile(f.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

export default Admin;
