import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';

function Navbar() {
  const navigate = useNavigate(); const location = useLocation(); const [user, setUser] = useState(null);
  useEffect(() => { getUser().then(setUser).catch(() => {}); }, []);
  const signOut = async () => { try { await logout(); } finally { localStorage.removeItem('auth_token'); navigate('/login'); } };
  const links = [{to:'/dashboard',label:'Library'},{to:'/upload',label:'Upload'}, ...(user?.role === 'admin' ? [{to:'/admin',label:'Control room'}] : [])];
  return <nav className="ios-nav"><Link className="ios-brand" to="/dashboard"><img src="/logo.png" alt="LINKLY"/><span>LINKLY</span></Link><div className="ios-nav-links">{links.map(link => <Link key={link.to} to={link.to} style={location.pathname === link.to ? {background:'rgba(255,255,255,.1)',color:'#fff'} : undefined}>{link.label}</Link>)}</div><div className="ios-nav-actions"><Link className="nav-upload" to="/upload"><button>＋ New upload</button></Link><div className="ios-avatar" title={user?.name}>{user?.name?.slice(0,2).toUpperCase() || 'ME'}</div><button className="secondary" onClick={signOut}>Sign out</button></div></nav>;
}
export default Navbar;
