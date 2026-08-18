import { RickshawSVG } from "./Icons.jsx";

export default function Hero({ playing }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-eyebrow mono">Ricksha Wala · Bhojpuri Playlists</div>
        <h1>
          Baitho Bhaiya, <span>Chalo Gaon</span> Ki Ore
        </h1>
        <p>
          Power-pack Bhojpuri playlists to recharge yourself — pick a category below
          and let the ricksha roll.
        </p>
        <div className="rickshaw-wrap">
          <RickshawSVG playing={playing} />
        </div>
      </div>
    </header>
  );
}
