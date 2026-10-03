import React from 'react';
import { ArrowUpRight } from 'lucide-react';
export default function AboutSection({ c }) {
  return (
    <section id="about" className="section about">
      <div>
        <p className="eyebrow">THE IMAGE FITNESS WAY</p>
        <h2>{c.about}</h2>
      </div>
      <div>
        <p>{c.description}</p>
        <a href="#contact" className="underlink">
          Come see it for yourself <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
