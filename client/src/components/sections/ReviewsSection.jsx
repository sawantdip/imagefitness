import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
export default function ReviewsSection({ c }) {
  return (
    <section id="reviews" className="section">
      <div className="section-top">
        <div>
          <p className="eyebrow">THE COMMUNITY SPEAKS</p>
          <h2>Real people. Real progress.</h2>
        </div>
        <span className="review-label">
          MEMBER STORIES <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="review-grid">
        {c.reviews.map((r, i) => (
          <article key={i}>
            <div className="stars">
              {Array.from({ length: Math.min(5, Math.max(1, Number(r.rating) || 5)) }, (_, j) => (
                <Star key={j} size={15} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{r.text}”</blockquote>
            <div className="review-person">
              <span>{r.name[0]}</span>
              <div>
                <b>{r.name}</b>
                <small>Image Fitness member</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
