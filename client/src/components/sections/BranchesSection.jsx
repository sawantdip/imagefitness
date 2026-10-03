import React from 'react';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';

export default function BranchesSection({ c }) {
  if (!c.branches?.length) return null;
  return (
    <section id="branches" className="section branches">
      <div className="section-top">
        <div>
          <p className="eyebrow">YOUR COMMUNITY, CLOSER TO HOME</p>
          <h2>Find your Image Fitness.</h2>
        </div>
        <p>
          Explore our locations.
          <br />
          Find the branch that fits your routine.
        </p>
      </div>
      <div className="branch-grid">
        {c.branches.map((branch, index) => {
          const directions =
            branch.mapUrl ||
            'https://www.google.com/maps/search/?api=1&query=' +
              encodeURIComponent(c.name + ' ' + branch.address);
          return (
            <article className="branch-card" key={index}>
              {branch.image && (
                <img
                  className="branch-photo"
                  src={branch.image}
                  alt={branch.name + ' gym'}
                  loading="lazy"
                />
              )}
              <div className="branch-body">
                <span className="branch-number">LOCATION {String(index + 1).padStart(2, '0')}</span>
                <h3>{branch.name}</h3>
                {branch.description && <p>{branch.description}</p>}
                <div className="branch-detail">
                  <MapPin size={17} />
                  <span>{branch.address}</span>
                </div>
                {(branch.hours || branch.sunday) && (
                  <div className="branch-detail">
                    <Clock size={17} />
                    <div>
                      {branch.hours && <span>{branch.hours}</span>}
                      {branch.sunday && <span>{branch.sunday}</span>}
                    </div>
                  </div>
                )}
                {branch.phone && (
                  <div className="branch-detail">
                    <Phone size={17} />
                    <a href={'tel:' + branch.phone}>{branch.phone}</a>
                  </div>
                )}
                <div className="branch-actions">
                  <a className="button small" href={directions} target="_blank" rel="noreferrer">
                    Get directions <ArrowUpRight size={16} />
                  </a>
                  <a className="underlink" href="#contact">
                    Enquire now <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
