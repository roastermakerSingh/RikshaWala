import { useState, useEffect } from "react";

function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const time = now
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .toLowerCase();

  return <div className="hero-clock mono">{time}</div>;
}

function StringLights() {
  const colors = ["#F5B301", "#C1440E", "#1F6E43", "#F5B301", "#8C2A44", "#F5B301"];
  return (
    <svg className="string-lights" viewBox="0 0 1200 90" preserveAspectRatio="none">
      <path
        d="M0 20 Q 150 70 300 25 T 600 30 T 900 20 T 1200 30"
        fill="none"
        stroke="#5a4a2a"
        strokeWidth="2"
        opacity="0.5"
      />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = (1200 / 15) * i;
        const y = 22 + Math.sin(i * 0.9) * 22;
        return (
          <g key={i} className="bulb" style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
            <circle cx={x} cy={y + 10} r="5" fill={colors[i % colors.length]} />
            <circle cx={x} cy={y + 10} r="9" fill={colors[i % colors.length]} opacity="0.25" />
          </g>
        );
      })}
    </svg>
  );
}

function SkylineSilhouette() {
  return (
    <svg className="skyline" viewBox="0 0 1200 160" preserveAspectRatio="none">
      <path
        fill="#140f0a"
        d="M0 160 L0 100 L30 100 L30 70 L60 70 L60 100 L90 90 L90 40 L110 40 L110 20 L130 20 L130 40 L150 40 L150 95
           L190 95 L190 60 L230 60 L230 95 L260 80 L260 30 L280 30 L280 10 L300 10 L300 30 L320 30 L320 85
           L360 85 L360 55 L400 55 L400 90 L430 90 L430 45 L450 45 L450 20 L470 20 L470 45 L490 45 L490 95
           L540 95 L540 70 L580 70 L580 100 L620 100 L620 35 L640 35 L640 15 L660 15 L660 35 L680 35 L680 100
           L720 100 L720 60 L760 60 L760 90 L800 90 L800 40 L830 40 L830 20 L850 20 L850 40 L870 40 L870 95
           L910 95 L910 65 L950 65 L950 100 L990 100 L990 30 L1010 30 L1010 10 L1030 10 L1030 30 L1050 30 L1050 90
           L1090 90 L1090 55 L1130 55 L1130 95 L1170 95 L1170 70 L1200 70 L1200 160 Z"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <header className="hero-cinematic">
      <div className="hero-cinematic-sky"></div>
      <ClockWidget />
      <svg className="hero-cinematic-sun" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="70" fill="url(#sunGrad)" />
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD35C" />
            <stop offset="60%" stopColor="#F5B301" />
            <stop offset="100%" stopColor="#C1440E" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <StringLights />

      <div className="hero-cinematic-content">
        <div className="hero-eyebrow mono">Ricksha Wala · Bhojpuri Playlists</div>
        <h1 className="hero-hindi">भोजपुरी एक्सप्रेस</h1>
        <p className="hero-english">
          Baitho Bhaiya, Chalo Gaon Ki Ore — pick a category below and let the ricksha roll.
        </p>
      </div>

      <svg className="hero-rickshaw-silhouette" viewBox="0 0 320 220">
        <g fill="#0f0b07">
          <path d="M40 130 Q40 70 130 70 L170 70 Q220 70 230 130 Z" />
          <rect x="30" y="126" width="180" height="60" rx="14" />
          <rect x="210" y="150" width="45" height="38" rx="8" />
        </g>
        <g className="wheel" style={{ transformOrigin: "95px 190px" }}>
          <circle cx="95" cy="190" r="28" fill="#0f0b07" />
          <circle cx="95" cy="190" r="28" fill="none" stroke="#3a2f22" strokeWidth="3" />
        </g>
        <g className="wheel" style={{ transformOrigin: "195px 190px" }}>
          <circle cx="195" cy="190" r="28" fill="#0f0b07" />
          <circle cx="195" cy="190" r="28" fill="none" stroke="#3a2f22" strokeWidth="3" />
        </g>
      </svg>

      <SkylineSilhouette />
      <div className="hero-cinematic-vignette"></div>
    </header>
  );
}
