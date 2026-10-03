import React from 'react';
import { ArrowUpRight, ArrowRight, MapPin } from 'lucide-react';
export default function HeroSection({ c }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(12,17,12,.91),rgba(12,17,12,.25)),url("${c.heroImage}")`,
      }}
    >
      <div className="hero-content">
        <p className="eyebrow">
          <span /> {c.eyebrow}
        </p>
        <h1>
          {c.headline.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              <span className={i ? 'accent' : ''}>{line}</span>
              <br />
            </React.Fragment>
          ))}
        </h1>
        <p className="hero-description">{c.tagline}</p>
        <div className="actions">
          <a className="button" href="#contact">
            Start your journey <ArrowUpRight size={19} />
          </a>
          <a className="text-link" href="#about">
            Explore the gym <ArrowRight size={18} />
          </a>
        </div>
        <div className="hero-location">
          <MapPin size={15} /> {c.address} <span>•</span> ALL FITNESS LEVELS WELCOME
        </div>
      </div>
      <div className="hero-note">
        <span>01 /</span> SHOW UP FOR YOURSELF.
        <br />
        WE’LL TAKE IT FROM HERE.
      </div>
    </section>
  );
}
