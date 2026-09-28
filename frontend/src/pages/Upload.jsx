import { useState } from 'react';
import { uploadFile } from '../services/fileService';
import Navbar from '../components/Navbar';
import FadeIn from '../components/FadeIn';
import QRCodeBlock from '../components/QRCodeBlock';
import DynamicIslandProgress from '../components/DynamicIslandProgress';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null); // null | 'uploading' | 'success'
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState('never');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError('');
    setStatus(null);
  };

  const selectFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setResult(null);
    setError('');
    setStatus(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError('');
    setStatus('uploading');
    setProgress(0);

    try {
      const data = await uploadFile(selectedFile, (pct) => setProgress(pct), expiresIn);
      setResult(data);
      setStatus('success');
      setTimeout(() => setStatus(null), 2200);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
      setStatus(null);
    }
  };

  const shareUrl = result ? `${window.location.origin}/f/${result.share_token}` : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <DynamicIslandProgress status={status} progress={progress} />
      <Navbar />
      <main className="app-shell" style={{ maxWidth: '760px' }}>
        <FadeIn>
          <div className="glass-card">
            <p className="eyebrow">Secure transfer</p>
            <h1 style={{ fontSize: '32px', margin: '6px 0 8px' }}>Send a file, beautifully.</h1>
            <p className="muted" style={{ marginBottom: '22px' }}>Your upload stays private until someone uses its unique share link.</p>

            <div className="upload-zone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selectFile(e.dataTransfer.files[0]); }}>
              <div className="upload-orb">↑</div>
              <p style={{ fontWeight: 700, margin: '16px 0 6px' }}>{selectedFile ? selectedFile.name : 'Drop a file here or browse'}</p>
              <p className="muted" style={{ fontSize: 13 }}>{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB ready to send` : 'Up to 100 MB · all common file formats'}</p>
              <input type="file" onChange={handleFileChange} />
            </div>

            <label className="muted" style={{ display: 'block', fontSize: 13, marginBottom: 8 }}>Link expiry</label>
            <select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)} style={{ width: '100%', marginBottom: 16 }} className="expiry-select">
              <option value="never">Never expires</option><option value="7_days">7 days</option><option value="1_day">24 hours</option><option value="1_hour">1 hour</option>
            </select>

            <button onClick={handleUpload} disabled={!selectedFile || status === 'uploading'} style={{ width: '100%' }}>
              {status === 'uploading' ? `Uploading... ${progress}%` : 'Upload'}
            </button>

            {error && <p style={{ color: '#ff8080', marginTop: '12px' }}>{error}</p>}

            {result && (
              <FadeIn delay={0.1}>
                <div className="glass-card" style={{ marginTop: '20px', background: 'rgba(101, 199, 255, 0.08)', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700 }}>✅ Upload complete!</p>
                  <p style={{ marginTop: '6px' }}>{result.original_name}</p>

                  <div style={{ margin: '18px 0' }}>
                    <QRCodeBlock value={shareUrl} />
                  </div>

                  <p style={{ color: 'var(--muted)', fontSize: '13px', wordBreak: 'break-all' }}>{shareUrl}</p>

                  <button onClick={handleCopy} className={copied ? '' : 'secondary'} style={{ marginTop: '12px' }}>
                    {copied ? '✓ Copied!' : 'Copy link'}
                  </button>
                </div>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

export default Upload;
