import React from 'react';
export default function ContentField({ fieldKey: key, value, index, group, field, photo }) {
  return (
    <label key={key}>
      {key.replace(/([A-Z])/g, ' $1')}{' '}
      {key.toLowerCase().includes('image') ? (
        <>
          <input value={value} onChange={(e) => field(key, e.target.value, index, group)} />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => photo(e, key, index, group)}
          />
          {value && <img className="image-preview" src={value} alt="Preview" />}
        </>
      ) : ['description', 'tagline', 'headline', 'text', 'about'].includes(key) ? (
        <textarea value={value} onChange={(e) => field(key, e.target.value, index, group)} />
      ) : (
        <input
          type={key === 'rating' ? 'number' : 'text'}
          min={key === 'rating' ? 1 : undefined}
          max={key === 'rating' ? 5 : undefined}
          value={value}
          onChange={(e) =>
            field(key, key === 'rating' ? Number(e.target.value) : e.target.value, index, group)
          }
        />
      )}
    </label>
  );
}
