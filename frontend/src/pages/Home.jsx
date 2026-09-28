import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToastMsg(message);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  };

  return (
    <div className="home-page">
      <nav className="nav">
        <a className="brand" href="#">
          <div className="logo">
            {/* Drop your logo image at frontend/public/logo.png and it'll show here automatically */}
            <img src="/logo.png" alt="LINKLY logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
          </div>
          <span>LINKLY</span>
        </a>
        <div className="links">
          <a className="active" href="#">Home</a>
          <a href="#features">Features</a>
          <a href="#process">How it works</a>
        </div>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => showToast('Theme controls coming soon')}>☼</button>
          <button className="login" onClick={() => navigate('/login')}>Login</button>
          <button className="cta" onClick={() => navigate('/register')}>Get Started ↗</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-grid">
            <div>
              <div className="badge"><span className="dot"></span> Fast &nbsp;•&nbsp; Secure &nbsp;•&nbsp; Easy to Share</div>
              <h1>Share Files<br /><span className="gradient">Without Limits.</span></h1>
              <p>Upload your files, get a unique link, and share it with anyone. Simple, secure, and built for the modern web.</p>
              <div className="buttons">
                <button className="primary" onClick={() => navigate('/register')}>↥ &nbsp; Upload File</button>
                <button className="secondary" onClick={() => showToast('Demo mode — full walkthrough coming soon')}>▷ &nbsp; Watch Demo</button>
              </div>
              <div className="trust">
                <div className="avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                <span>Trusted by 10,000+ users</span>
                <span className="stars">★★★★★</span>
              </div>
            </div>

            <div className="phone-wrap">
              <div className="glow"></div>
              <div className="file-card">
                <div className="file-top">
                  <div className="file-icon">📄</div>
                  <div>
                    <div className="file-name">Project_Final.pdf</div>
                    <div className="file-meta">4.2 MB • PDF</div>
                  </div>
                </div>
                <div className="file-link"><span>linkly.com/f/8xK92Lm</span><b>⧉</b></div>
              </div>
              <div className="file-card">
                <div className="file-top">
                  <div className="file-icon">▶</div>
                  <div>
                    <div className="file-name">Vacation.mp4</div>
                    <div className="file-meta">58 MB • MP4</div>
                  </div>
                </div>
                <div className="file-link"><span>linkly.com/f/Q7Lm92Xa</span><b>⧉</b></div>
              </div>

              <div className="phone">
                <div className="phone-screen">
                  <div className="status"><span>9:41</span><span>● ◐ ▰</span></div>
                  <div className="phone-title">Upload Your File</div>
                  <div className="phone-sub">Drag and drop or click to browse</div>
                  <div className="drop" onClick={() => navigate('/register')}>
                    <div>
                      <div className="upload-icon">☁</div>
                      <small>Choose a file to share</small>
                      <button className="mini-btn">Browse Files</button>
                    </div>
                  </div>
                  <div className="type-row">
                    <span>▧ Images</span>
                    <span>▷ Videos</span>
                    <span>▤ Docs</span>
                    <span>⌁ Other</span>
                  </div>
                  <button className="phone-upload" onClick={() => navigate('/register')}>Upload File</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="feature-grid">
            <article className="feature">
              <div className="feature-icon">ϟ</div>
              <h3>Lightning Fast</h3>
              <p>Upload and share files in seconds with an optimized workflow.</p>
            </article>
            <article className="feature">
              <div className="feature-icon">♢</div>
              <h3>Secure Sharing</h3>
              <p>Unique links, validation and controlled access keep files safer.</p>
            </article>
            <article className="feature">
              <div className="feature-icon">☁</div>
              <h3>Multiple File Types</h3>
              <p>Images, videos, documents, archives and more in one place.</p>
            </article>
            <article className="feature">
              <div className="feature-icon">▣</div>
              <h3>Access Anywhere</h3>
              <p>Open a shared link from your phone, tablet or computer.</p>
            </article>
          </div>
        </section>

        <section className="process" id="process">
          <h2>Upload. Get Link. <span>Share.</span></h2>
          <div className="process-row">
            <div className="step">
              <div className="step-num">01</div>
              <div>
                <h4>Upload File</h4>
                <p>Choose a supported file and upload it to LINKLY.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div>
                <h4>Get Link</h4>
                <p>LINKLY generates a unique shareable link automatically.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div>
                <h4>Share</h4>
                <p>Copy the link and send it to anyone who needs the file.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}

export default Home;