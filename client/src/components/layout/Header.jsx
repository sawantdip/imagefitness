import React, { useState } from 'react';
import { ArrowUpRight, Dumbbell, Menu, X } from 'lucide-react';
export default function Header({ c }) {
  const [menu, setMenu] = useState(false);
  return (
    <header>
      <a className="brand" href="#">
        <Dumbbell />
        <span>
          {c.name}
          <small>STRONGER TOGETHER</small>
        </span>
      </a>
      <button
        className="mobile"
        aria-label="Toggle menu"
        aria-expanded={menu}
        aria-controls="site-navigation"
        onClick={() => setMenu(!menu)}
      >
        {menu ? <X /> : <Menu />}
      </button>
      <nav id="site-navigation" className={menu ? 'open' : ''}>
        {[
          'About',
          'Training',
          'Trainers',
          'Facilities',
          'Reviews',
          ...(c.branches?.length ? ['Branches'] : []),
        ].map((x) => (
          <a key={x} href={'#' + x.toLowerCase()} onClick={() => setMenu(false)}>
            {x}
          </a>
        ))}
        <a className="button small" href="#contact">
          Visit the gym <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  );
}
