import React from 'react';

export default function StatsSection({ c }) {
  return (
    <div className="stats">
      {c.stats.map((s, i) => (
        <div key={i}>
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
      <div className="community">
        <div className="avatars">
          {c.trainers.map((t, i) => (
            <img key={i} src={t.image} alt="" />
          ))}
        </div>
        <span>
          A little effort.
          <br />
          <b>A stronger you.</b>
        </span>
      </div>
    </div>
  );
}
