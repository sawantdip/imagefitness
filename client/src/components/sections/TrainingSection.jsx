import React from 'react';
import { ArrowUpRight, Dumbbell, Activity, Heart, Target } from 'lucide-react';
export default function TrainingSection({ c }) {
  const icons = [Dumbbell, Activity, Target, Heart];
  return (
    <section id="training" className="section training">
      <div className="section-top">
        <div>
          <p className="eyebrow">FIND YOUR STRONG</p>
          <h2>Your goals. Your way.</h2>
        </div>
        <p>
          Different starting points.
          <br />
          The same commitment to you.
        </p>
      </div>
      <div className="service-grid">
        {c.services.map((s, i) => {
          const Icon = icons[i % 4];
          return (
            <article key={i}>
              <div className="service-icon">
                <Icon size={25} />
                <span>0{i + 1}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <a href="#contact" aria-label={'Ask about ' + s.title}>
                <ArrowUpRight size={22} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
