import AdminLogin from '../components/admin/AdminLogin.jsx';
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Dumbbell, Plus, Trash2, LogOut, Save } from 'lucide-react';
import { api } from '../services/api.js';
import ContentField from '../components/admin/ContentField.jsx';
export default function Admin({ content, update }) {
  const [token, setToken] = useState(false),
    [draft, setDraft] = useState(structuredClone(content)),
    [tab, setTab] = useState('General'),
    [msg, setMsg] = useState(''),
    [busy, setBusy] = useState(false),
    [inquiries, setInquiries] = useState([]),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [loadingInquiries, setLoadingInquiries] = useState(false),
    [checkingSession, setCheckingSession] = useState(true);
  const groups = {
    Stats: 'stats',
    Training: 'services',
    Trainers: 'trainers',
    Equipment: 'equipment',
    Reviews: 'reviews',
    Branches: 'branches',
  };
  useEffect(() => {
    api('/auth/session')
      .then(() => setToken(true))
      .catch(() => setToken(false))
      .finally(() => setCheckingSession(false));
  }, []);
  useEffect(() => {
    if (token && tab === 'Enquiries') {
      setLoadingInquiries(true);
      api('/inquiries?page=' + page)
        .then((r) => {
          setInquiries(r.items);
          setTotal(r.total);
        })
        .catch((e) => setMsg(e.message))
        .finally(() => setLoadingInquiries(false));
    }
  }, [tab, token, page]);
  useEffect(() => {
    const expired = () => setToken(false);
    window.addEventListener('admin-session-expired', expired);
    return () => window.removeEventListener('admin-session-expired', expired);
  }, []);
  useEffect(() => {
    const warn = (e) => {
      if (JSON.stringify(draft) !== JSON.stringify(content)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [draft, content]);
  function field(key, value, index, group) {
    setDraft((d) => {
      const next = structuredClone(d);
      if (group) next[group][index][key] = value;
      else next[key] = value;
      return next;
    });
  }
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await api('/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      });
      setToken(true);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setMsg('');
    try {
      await api('/content', { method: 'PUT', body: JSON.stringify(draft) });
      update(structuredClone(draft));
      setMsg('Website updated successfully.');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function photo(e, key, index, group) {
    if (!e.target.files[0]) return;
    if (e.target.files[0].size > 3 * 1024 * 1024) {
      setMsg('Image must be under 3 MB.');
      return;
    }
    setBusy(true);
    try {
      const data = new FormData();
      data.append('image', e.target.files[0]);
      const r = await api('/upload', { method: 'POST', body: data });
      field(key, r.url, index, group);
      setMsg('Photo uploaded. Save changes to publish it.');
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }
  function input(key, value, index, group) {
    return (
      <ContentField
        key={key}
        fieldKey={key}
        value={value}
        index={index}
        group={group}
        field={field}
        photo={photo}
      />
    );
  }
  if (checkingSession) return <div className="loading">Checking admin session…</div>;
  if (!token) return <AdminLogin login={login} msg={msg} busy={busy} />;
  const group = groups[tab];
  return (
    <div className="admin">
      <aside>
        <a className="brand" href="/">
          <Dumbbell />
          <span>
            IMAGE FITNESS<small>CONTENT STUDIO</small>
          </span>
        </a>
        <nav>
          {['General', ...Object.keys(groups), 'Contact', 'Enquiries'].map((t) => (
            <button
              className={tab === t ? 'selected' : ''}
              key={t}
              onClick={() => {
                setTab(t);
                setMsg('');
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" className="underlink">
          View website <ArrowUpRight size={15} />
        </a>
        <button
          className="logout"
          onClick={() => {
            api('/logout', { method: 'POST' })
              .then(() => setToken(false))
              .catch((e) => setMsg(e.message));
          }}
        >
          <LogOut size={17} /> Sign out
        </button>
      </aside>
      <div className="admin-main">
        <div className="admin-top">
          <div>
            <p className="eyebrow">YOUR WEBSITE, YOUR WAY</p>
            <h2>{tab === 'Enquiries' ? 'Customer enquiries' : tab + ' content'}</h2>
            <p>Update your website without writing any code.</p>
          </div>
          {tab !== 'Enquiries' && (
            <button disabled={busy} className="button" onClick={save}>
              <Save size={17} />
              {busy ? 'Working…' : 'Save changes'}
            </button>
          )}
        </div>
        {msg && (
          <div role="status" className="notice">
            {msg}
          </div>
        )}
        {group ? (
          <>
            <div className="admin-cards">
              {draft[group].map((item, i) => (
                <article key={i}>
                  <div className="edit-card-top">
                    <h3>{item.name || item.title || item.label || 'Item ' + (i + 1)}</h3>
                    <button
                      aria-label="Remove item"
                      onClick={() =>
                        setDraft((d) => ({ ...d, [group]: d[group].filter((_, j) => j !== i) }))
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  {Object.entries(item).map(([k, v]) => input(k, v, i, group))}
                </article>
              ))}
            </div>
            <button
              className="button secondary"
              onClick={() => {
                const templates = {
                  stats: { value: '', label: '' },
                  services: { title: 'New training', description: '' },
                  trainers: { name: 'New trainer', role: '', experience: '', image: '' },
                  equipment: { name: 'New equipment', description: '', image: '' },
                  reviews: { name: 'New member', text: '', rating: 5 },
                  branches: {
                    name: 'New branch',
                    address: '',
                    phone: '',
                    hours: '',
                    sunday: '',
                    description: '',
                    mapUrl: '',
                    image: '',
                  },
                };
                setDraft((d) => ({ ...d, [group]: [...d[group], templates[group]] }));
              }}
            >
              <Plus size={17} /> Add {tab.toLowerCase()} item
            </button>
          </>
        ) : tab === 'Enquiries' ? (
          <div className="inquiries">
            {loadingInquiries && <p role="status">Loading enquiries…</p>}
            {inquiries.length ? (
              inquiries.map((x, i) => (
                <article key={i}>
                  <span>{new Date(x.createdAt).toLocaleString()}</span>
                  <h3>{x.name}</h3>
                  {x.branch && (
                    <p>
                      <b>Preferred branch:</b> {x.branch}
                    </p>
                  )}
                  <a href={'tel:' + x.phone}>{x.phone}</a>
                  <p>
                    <a href={'mailto:' + x.email}>{x.email}</a>
                  </p>
                  <p>{x.message}</p>
                </article>
              ))
            ) : (
              <p>No enquiries yet. Messages sent through the website will appear here.</p>
            )}
            <div className="pagination">
              <button
                disabled={page === 1 || loadingInquiries}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} · {total} enquiries
              </span>
              <button
                disabled={page * 20 >= total || loadingInquiries}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-fields">
            {(tab === 'General'
              ? ['name', 'eyebrow', 'headline', 'tagline', 'about', 'description', 'heroImage']
              : ['address', 'phone', 'email', 'hours', 'sunday', 'instagram']
            ).map((k) => input(k, draft[k]))}
          </div>
        )}
      </div>
    </div>
  );
}
