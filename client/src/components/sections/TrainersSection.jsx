import React from 'react';
import { ArrowUpRight } from 'lucide-react';
export default function TrainersSection({ c }) {
  return (
    <section id="trainers" className="section">
      <div className="section-top">
        <div>
          <p className="eyebrow">GOOD PEOPLE. GREAT COACHES.</p>
          <h2>In your corner.</h2>
        </div>
        <p>
          Expert guidance. Real encouragement.
          <br />
          Meet the people behind your progress.
        </p>
      </div>
      <div className="trainer-grid">
        {c.trainers.map((t, i) => (
          <article className="trainer" key={i}>
            <div className="photo">
              <img src={t.image} alt={t.name} loading="lazy" />
              <span>{t.experience}</span>
            </div>
            <div className="trainer-info">
              <div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </div>
              <a href="#contact" aria-label={'Train with ' + t.name}>
                <ArrowUpRight />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
