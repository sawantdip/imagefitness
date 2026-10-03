import React from 'react';
import { Check } from 'lucide-react';
export default function FacilitiesSection({ c }) {
  return (
    <section id="facilities" className="section facilities">
      <div className="section-top">
        <div>
          <p className="eyebrow">SPACE TO GO FURTHER</p>
          <h2>
            Everything you need.
            <br />
            Room to do more.
          </h2>
        </div>
        <p>
          Purposeful equipment. A welcoming space.
          <br />
          Built for your everyday best.
        </p>
      </div>
      <div className="equipment-grid">
        {c.equipment.map((m, i) => (
          <article key={i}>
            <img src={m.image} alt={m.name} loading="lazy" />
            <div>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="amenities">
        <span>
          <Check size={16} /> Clean & spacious
        </span>
        <span>
          <Check size={16} /> Changing rooms
        </span>
        <span>
          <Check size={16} /> Expert support
        </span>
        <span>
          <Check size={16} /> Positive community
        </span>
      </div>
    </section>
  );
}
