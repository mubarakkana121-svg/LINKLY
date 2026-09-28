import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import SharedFile from './pages/SharedFile';
import Admin from './pages/Admin';
import Home from './pages/Home';
import IntegrationsDemo from './pages/IntegrationsDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/f/:token" element={<SharedFile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/integrations-demo" element={<IntegrationsDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
