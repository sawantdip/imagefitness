import React from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';
export default function AdminLogin({ login, msg, busy }) {
  return (
    <div className="login-page">
      <a className="brand" href="/">
        <Dumbbell />
        <span>
          IMAGE FITNESS<small>CONTENT STUDIO</small>
        </span>
      </a>
      <form className="login-card" onSubmit={login}>
        <p className="eyebrow">ADMIN ACCESS</p>
        <h2>Welcome back.</h2>
        <p>Sign in to manage your gym website.</p>
        <label>
          Email
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {msg && (
          <p role="alert" className="error">
            {msg}
          </p>
        )}
        <button className="button" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={18} />
        </button>
        <a className="underlink" href="/">
          ← Back to website
        </a>
      </form>
    </div>
  );
}
