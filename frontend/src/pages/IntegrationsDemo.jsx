import { useState, useEffect } from 'react';

const API = "http://127.0.0.1:8000/api";

export default function IntegrationsDemo(){
  const [githubUser, setGithubUser] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [mapboxResult, setMapboxResult] = useState(null);
  const [mapboxHistory, setMapboxHistory] = useState([]);
  const [booksResult, setBooksResult] = useState(null);
  const [booksHistory, setBooksHistory] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("Sokoto, Nigeria");
  const [bookQuery, setBookQuery] = useState("Laravel");

  const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('access_token') || localStorage.getItem('sanctum_token');
  const headers = token ? { Authorization: 'Bearer '+token, Accept: 'application/json' } : { Accept: 'application/json' };

  const checkAuth = () => {
    if(!token){
      const keys = Object.keys(localStorage);
      setError(`No token found! Keys in storage: ${keys.join(', ')}. Login at /login first. Try opening console: localStorage.getItem('token')`);
      console.log('localStorage keys:', keys);
      keys.forEach(k=> console.log(k, ':', localStorage.getItem(k)?.substring(0,50)));
      return false;
    }
    return true;
  };

  const fetchGithubUser = async () => {
    if(!checkAuth()) return;
    setLoading(s=>({...s,github:true})); setError(null);
    try{
      const r=await fetch(API+'/integrations/github/user',{headers});
      const text=await r.text(); let d; try{d=JSON.parse(text)}catch{d={raw:text}};
      console.log("GitHub User status", r.status, d);
      if(!r.ok) throw new Error(`HTTP ${r.status}: ${d.message||d.error||text.substring(0,200)}`);
      setGithubUser(d);
    }catch(e){ console.error(e); setError("GitHub User: "+e.message); }
    setLoading(s=>({...s,github:false}));
  };

  const fetchGithubRepos = async () => {
    if(!checkAuth()) return;
    setLoading(s=>({...s,repos:true})); setError(null);
    try{
      const r=await fetch(API+'/integrations/github/repos',{headers});
      const text=await r.text(); let d; try{d=JSON.parse(text)}catch{d={raw:text}};
      console.log("GitHub Repos status", r.status, d);
      if(!r.ok) throw new Error(`HTTP ${r.status}: ${d.message||d.error||text.substring(0,300)}`);
      setGithubRepos(d.repos||d.data||[]);
    }catch(e){ console.error(e); setError("GitHub Repos: "+e.message); }
    setLoading(s=>({...s,repos:false}));
  };

  const searchMapbox = async (e) => {
    e?.preventDefault();
    if(!checkAuth()) return;
    setLoading(s=>({...s,mapbox:true})); setError(null);
    try{
      const r=await fetch(API+'/integrations/mapbox/search',{method:'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify({query})});
      const text=await r.text(); let d; try{d=JSON.parse(text)}catch{d={raw:text}};
      console.log("Mapbox status", r.status, d);
      if(!r.ok) throw new Error(`HTTP ${r.status}: ${d.message||d.error||text.substring(0,300)}`);
      setMapboxResult(d);
      const h=await fetch(API+'/integrations/mapbox/locations',{headers}); 
      const hd = h.ok ? await h.json() : [];
      setMapboxHistory(Array.isArray(hd)?hd:[]);
    }catch(e){ console.error(e); setError("Mapbox: "+e.message); }
    setLoading(s=>({...s,mapbox:false}));
  };

  const searchBooks = async (e) => {
    e?.preventDefault();
    if(!checkAuth()) return;
    setLoading(s=>({...s,books:true})); setError(null);
    try{
      console.log("Searching books:", bookQuery);
      const r=await fetch(API+'/integrations/google-books/search',{method:'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify({query:bookQuery})});
      const text=await r.text(); let d; try{d=JSON.parse(text)}catch{d={raw:text}};
      console.log("Books status", r.status, d);
      if(!r.ok) throw new Error(`HTTP ${r.status}: ${d.message||d.error||text.substring(0,300)}`);
      setBooksResult(d);
      const h=await fetch(API+'/integrations/google-books',{headers}); 
      const hd= h.ok ? await h.json() : [];
      console.log("Books History:", hd);
      setBooksHistory(Array.isArray(hd)?hd:[]);
    }catch(e){ console.error(e); setError("Books: "+e.message); }
    setLoading(s=>({...s,books:false}));
  };

  useEffect(()=>{
    if(!token) { setError("Please login first - no auth_token in localStorage. Go to /login"); return; }
    (async()=>{
      try{
        const h=await fetch(API+'/integrations/mapbox/locations',{headers}); 
        if(h.ok) {
          const jd = await h.json();
          setMapboxHistory(Array.isArray(jd)?jd:[]);
        }
        const bh=await fetch(API+'/integrations/google-books',{headers});
        if(bh.ok) {
          const jd = await bh.json();
          setBooksHistory(Array.isArray(jd)?jd:[]);
        }
        const gh=await fetch(API+'/integrations/github/repos/local',{headers});
        if(gh.ok) { const d=await gh.json(); setGithubRepos(d.data||d||[]); }
      }catch(e){ console.log(e) }
    })();
  },[]);

  return (
    <div className="app-shell">
      <div className="page-heading">
        <div>
          <div className="eyebrow">LINKLY // 3 External APIs - MySQL</div>
          <h1><span className="gradient-text">External APIs</span> Integration Demo</h1>
          <p className="muted">Flow: External API → Service (Http::get) → Controller → MySQL. Proves not just CRUD.</p>
        </div>
      </div>

      {error && (
        <div className="glass-card" style={{background:'rgba(255,60,60,0.12)', borderColor:'rgba(255,60,60,0.3)', marginBottom:18}}>
          <strong style={{color:'#ff6b6b'}}>Error:</strong> <span className="muted">{error}</span>
        </div>
      )}

      <div className="metric-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        <div className="metric"><small>GITHUB API</small><strong>{githubRepos.length} repos</strong><span>github_repos • Token auth</span></div>
        <div className="metric"><small>MAPBOX API</small><strong>{mapboxHistory.length} locations</strong><span>mapbox_locations • Token</span></div>
        <div className="metric"><small>GOOGLE BOOKS</small><strong style={{color:'#4caf50'}}>{booksHistory.length} books FREE</strong><span>google_books • No billing</span></div>
      </div>

      <div className="content-grid" style={{gridTemplateColumns:'1fr 1fr', gap:18, marginTop:18}}>
        <div className="glass-card">
          <div className="section-title"><h3>1. GitHub API</h3><span className="muted" style={{fontSize:10}}>GithubService.php</span></div>
          <div className="toolbar">
            <button onClick={fetchGithubUser} disabled={loading.github}>{loading.github?'...':'Test User'}</button>
            <button className="secondary" onClick={fetchGithubRepos} disabled={loading.repos}>{loading.repos?'...':'Fetch Repos'}</button>
          </div>
          {githubUser && (
            <div style={{background:'rgba(0,0,0,.4)', border:'1px solid var(--line)', borderRadius:14, padding:14, marginTop:12, display:'flex', gap:12, alignItems:'center'}}>
              <img src={githubUser.data?.avatar_url} alt="" style={{width:40,height:40,borderRadius:10}}/>
              <div><div style={{fontWeight:700}}>{githubUser.data?.login}</div><div className="muted" style={{fontSize:11}}>{githubUser.message} • {githubUser.data?.public_repos} repos</div></div>
              <span className="ios-status" style={{marginLeft:'auto'}}>OK</span>
            </div>
          )}
          {githubRepos.length>0 && <div className="file-list" style={{marginTop:12}}>{githubRepos.slice(0,4).map(r=><div key={r.id||r.github_id} className="file-row" style={{gridTemplateColumns:'42px 1fr'}}><div className="file-icon">⭐</div><div><div className="file-name">{r.name||r.full_name}</div><div className="file-meta">{r.language} • {r.stargazers_count||r.stars}★</div></div></div>)}</div>}
        </div>

        <div className="glass-card">
          <div className="section-title"><h3>2. Mapbox API</h3><span className="muted" style={{fontSize:10}}>MapboxService.php</span></div>
          <form onSubmit={searchMapbox} className="toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sokoto, Nigeria"/><button disabled={loading.mapbox}>{loading.mapbox?'...':'Search & Save'}</button></form>
          {mapboxResult && (
            <div style={{background:'rgba(66,100,251,.15)', border:'1px solid rgba(66,100,251,.3)', borderRadius:14, padding:12, marginTop:10}}>
              <div style={{fontWeight:700, fontSize:13}}>{mapboxResult.mapbox?.place_name||mapboxResult.place_name||"Found"}</div>
              <div className="muted" style={{fontSize:11}}>{mapboxResult.mapbox?.lat||mapboxResult.latitude}, {mapboxResult.mapbox?.lng||mapboxResult.longitude} • ID #{mapboxResult.stored?.id}</div>
            </div>
          )}
          {mapboxHistory.length>0 && <div className="file-list" style={{marginTop:12}}>{mapboxHistory.slice(0,3).map(l=><div key={l.id} className="file-row" style={{gridTemplateColumns:'42px 1fr'}}><div className="file-icon">📍</div><div><div className="file-name">{l.place_name}</div><div className="file-meta">{l.latitude},{l.longitude}</div></div></div>)}</div>}
        </div>

        <div className="glass-card" style={{gridColumn:'1 / -1', border:'1px solid rgba(76,175,80,0.3)', background:'rgba(76,175,80,0.05)'}}>
          <div className="section-title"><h3>3. Google Books API (FREE - No Billing) ⭐</h3><span className="muted" style={{fontSize:10}}>GoogleBooksService.php</span></div>
          <form onSubmit={searchBooks} className="toolbar">
            <input value={bookQuery} onChange={e=>setBookQuery(e.target.value)} placeholder="Search book e.g Laravel, PHP, Sokoto" style={{borderColor:'#4caf50'}}/>
            <button disabled={loading.books} style={{background:'linear-gradient(135deg,#4caf50,#8bc34a)', color:'#fff'}}>{loading.books?'Searching...':'Search Books & Save'}</button>
          </form>
          
          {booksResult && (
            <div style={{marginTop:12}}>
              <div className="muted" style={{fontSize:12, marginBottom:8, background:'rgba(76,175,80,0.15)', padding:8, borderRadius:8}}>✅ Found {booksResult.totalItems} books • Saved to google_books ID #{booksResult.stored?.id} • {booksResult.message}</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10}}>
                {booksResult.books?.slice(0,4).map(b=>{
                  const info=b.volumeInfo||{};
                  return (
                    <div key={b.id} style={{display:'flex', gap:10, padding:10, background:'rgba(0,0,0,.3)', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)'}}>
                      <img src={info.imageLinks?.thumbnail} alt="" style={{width:48, height:68, objectFit:'cover', borderRadius:6, background:'#222'}}/>
                      <div style={{minWidth:0}}><div style={{fontWeight:700, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{info.title}</div><div className="muted" style={{fontSize:11}}>{info.authors?.join(', ')} • {info.publishedDate}</div></div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {booksHistory.length>0 && (
            <div style={{marginTop:16}}>
              <div className="muted" style={{fontSize:12, marginBottom:8}}>MySQL: google_books ({booksHistory.length})</div>
              <div className="file-list">
                {booksHistory.slice(0,5).map(b=><div key={b.id} className="file-row" style={{gridTemplateColumns:'42px 1fr'}}><img src={b.thumbnail} alt="" style={{width:36, height:48, objectFit:'cover', borderRadius:6}}/><div><div className="file-name">{b.title}</div><div className="file-meta">{Array.isArray(b.authors)?b.authors.join(', '):b.authors} • {b.publisher}</div></div></div>)}
              </div>
            </div>
          )}
          {booksHistory.length===0 && !booksResult && <div className="muted" style={{marginTop:12, fontSize:12, textAlign:'center', padding:20}}>No books yet - search "Laravel" above</div>}
        </div>
      </div>

      <div className="glass-card" style={{marginTop:18}}>
        <h4>How to explain to lecturer</h4>
        <p className="muted" style={{fontSize:12, lineHeight:'1.6', marginTop:8}}>
          GithubService → Http::get(api.github.com/user) with token → github_repos table<br/>
          MapboxService → Http::get(api.mapbox.com/geocoding) → mapbox_locations table<br/>
          GoogleBooksService → Http::get(googleapis.com/books) FREE → google_books table<br/>
          Same pattern: Service layer uses Laravel Http client to consume external API, then saves to MySQL.
        </p>
      </div>
    </div>
  );
}