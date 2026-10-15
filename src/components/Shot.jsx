// A screenshot of the app in a device frame. Images are made-up sample data ("Sample Atelier").
export function Phone({ image, alt, className = '', eager = false }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">
        <img
          src={`/shots/${image}.webp`}
          srcSet={`/shots/${image}.webp 1x, /shots/${image}@2x.webp 2x`}
          width="390"
          height="844"
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </div>
  );
}

export function Laptop({ image, alt, className = '' }) {
  return (
    <div className={`laptop ${className}`}>
      <div className="laptop__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img src={`/shots/${image}.webp`} width="1440" height="900" alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}
