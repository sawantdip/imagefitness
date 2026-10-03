import React, { useState } from 'react';
import { ArrowUpRight, Dumbbell, Instagram } from 'lucide-react';
export default function Footer({ c }) {
  return (
    <footer>
      <a className="brand" href="#">
        <Dumbbell />
        <span>
          {c.name}
          <small>STRONGER TOGETHER</small>
        </span>
      </a>
      <span>
        © {new Date().getFullYear()} {c.name}. Keep showing up.
      </span>
      <div>
        <a href={c.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <Instagram size={19} />
        </a>
        <a href="/admin">
          Admin login <ArrowUpRight size={14} />
        </a>
      </div>
    </footer>
  );
}
