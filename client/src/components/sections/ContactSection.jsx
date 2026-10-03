import React, { useState } from 'react';
import { MapPin, Clock, Phone, Check, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api.js';
export default function ContactSection({ c }) {
  const [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/inquiries', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      });
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="contact" className="section contact">
      <div>
        <p className="eyebrow">ONE STEP IS ALL IT TAKES</p>
        <h2>
          Your next chapter.
          <br />
          <em>Starts here.</em>
        </h2>
        <p>
          Drop in, look around, and meet the team.
          <br />
          We’d love to welcome you.
        </p>
        <div className="contact-detail">
          <MapPin />
          <div>
            <b>Find us</b>
            <span>{c.address}</span>
            <a
              target="_blank"
              rel="noreferrer"
              href={
                'https://www.google.com/maps/search/?api=1&query=' +
                encodeURIComponent(c.name + ' ' + c.address)
              }
            >
              Get directions ↗
            </a>
          </div>
        </div>
        <div className="contact-detail">
          <Clock />
          <div>
            <b>Make time for you</b>
            <span>{c.hours}</span>
            <span>{c.sunday}</span>
          </div>
        </div>
        <div className="contact-detail">
          <Phone />
          <div>
            <b>Let’s talk</b>
            <a href={'tel:' + c.phone}>{c.phone}</a>
            <a href={'mailto:' + c.email}>{c.email}</a>
          </div>
        </div>
      </div>
      <div className="contact-form">
        {sent ? (
          <div className="success">
            <Check size={40} />
            <h3>You’re one step closer.</h3>
            <p>Your enquiry has reached our team. We’ll contact you soon.</p>
            <button className="button" onClick={() => setSent(false)}>
              Send another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3>Let’s get you started.</h3>
            <p>Leave your details. We’ll take it from there.</p>
            <label>
              Your name
              <input name="name" placeholder="Full name" required maxLength={100} />
            </label>
            <label>
              Phone number
              <input
                name="phone"
                type="tel"
                placeholder="Your mobile number"
                required
                maxLength={30}
              />
            </label>
            <label>
              Email address <small>(optional)</small>
              <input name="email" type="email" placeholder="you@example.com" maxLength={150} />
            </label>
            {!!c.branches?.length && (
              <label>
                Preferred branch <small>(optional)</small>
                <select name="branch" defaultValue="">
                  <option value="">Help me choose a branch</option>
                  {c.branches.map((branch, index) => (
                    <option key={index} value={branch.name + ' — ' + branch.address}>
                      {branch.name} — {branch.address}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              What’s your goal?
              <textarea
                name="message"
                placeholder="Tell us a little about what you’re looking for…"
                required
                maxLength={2000}
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button" disabled={busy}>
              {busy ? 'Sending…' : 'Send enquiry'}
              <ArrowUpRight size={19} />
            </button>
            <small>We’ll only use your details to respond to your enquiry.</small>
          </form>
        )}
      </div>
    </section>
  );
}
