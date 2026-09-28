import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDownloadUrl, getSharedFile } from '../services/fileService';
import FadeIn from '../components/FadeIn';
import QRCodeBlock from '../components/QRCodeBlock';

const bytes = value => value < 1024 ? `${value} B` : value < 1048576 ? `${(value / 1024).toFixed(1)} KB` : `${(value / 1048576).toFixed(1)} MB`;
const icon = type => type?.startsWith('image') ? '◈' : type?.startsWith('video') ? '▶' : '▧';
function SharedFile() {
  const { token } = useParams(); const [file, setFile] = useState(null); const [error, setError] = useState(''); const [copied, setCopied] = useState(false);
  useEffect(() => { getSharedFile(token).then(setFile).catch(err => setError(err.response?.status === 410 ? 'This link has expired.' : err.response?.status === 404 ? 'This file is no longer available.' : 'We could not open this file.')); }, [token]);
  const copy = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  if (!file && !error) return <div className="share-page"><div className="glass-card muted">Opening secure link…</div></div>;
  if (error) return <div className="share-page"><FadeIn><section className="glass-card shared-card"><div className="shared-file-icon">⌁</div><p className="eyebrow">LINK UNAVAILABLE</p><h1 style={{fontSize:28,marginTop:8}}>{error}</h1><p className="muted" style={{marginTop:13,lineHeight:1.6}}>Ask the sender to create a new link, or return to your library.</p><Link to="/"><button className="secondary" style={{marginTop:22}}>Go to LINKLY</button></Link></section></FadeIn></div>;
  return <main className="share-page"><FadeIn><section className="glass-card shared-card"><p className="eyebrow">A SECURE FILE FOR YOU</p><div className="shared-file-icon">{icon(file.file_type)}</div><h1 style={{fontSize:25,overflowWrap:'anywhere'}}>{file.original_name}</h1><div className="share-meta"><span>{file.file_type || 'File'}</span><span>{bytes(file.file_size)}</span><span>↓ {file.downloads || 0} downloads</span></div><div className="qr-sheet"><QRCodeBlock value={window.location.href} size={116}/></div><div className="share-actions"><a href={getDownloadUrl(token)}><button style={{width:'100%'}}>↓ Download file</button></a><button className="secondary" onClick={copy}>{copied ? '✓ Link copied' : 'Copy link'}</button></div><p className="share-security">◉ Private transfer · shared securely by LINKLY</p></section></FadeIn></main>;
}
export default SharedFile;
