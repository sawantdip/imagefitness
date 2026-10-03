import React, { useEffect, useState, lazy, Suspense } from 'react';
import { api } from './services/api.js';
import Website from './pages/Website.jsx';
const Admin = lazy(() => import('./pages/Admin.jsx'));
export default function App() {
  const [content, setContent] = useState(null),
    [error, setError] = useState('');
  function loadContent() {
    setError('');
    api('/content')
      .then(setContent)
      .catch((e) => setError(e.message));
  }
  useEffect(() => {
    loadContent();
  }, []);
  if (!content)
    return (
      <div className="loading" role="status">
        {error || 'Loading Image Fitness…'}
        {error && (
          <p>
            <button className="button" onClick={loadContent}>
              Try again
            </button>
          </p>
        )}
      </div>
    );
  return location.pathname.startsWith('/admin') ? (
    <Suspense fallback={<div className="loading">Loading admin…</div>}>
      <Admin content={content} update={setContent} />
    </Suspense>
  ) : (
    <Website c={content} />
  );
}
