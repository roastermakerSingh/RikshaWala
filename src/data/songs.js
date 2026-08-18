// 50 of Pawan Singh's well-known Bhojpuri song titles. These are used as
// YouTube search queries (via youtube/youtubeSearch.js) to resolve the actual
// official video for playback through the YouTube IFrame Player, so playback
// is always the real, licensed video hosted by YouTube / the rights holder's
// own channel — nothing is scraped or redistributed by this app.

const titles = [
  "Lollypop Lagelu",
  "Lehanga",
  "Solva Saal",
  "Tohar Sadi Sunkar",
  "Jawani Jhakjhor",
  "Dil Lagai Ke Phasal",
  "Muqaddar",
  "Raja Ji",
  "Aaho Raja",
  "Raja Rangbaaz",
  "Sorry Sorry Bhojpuriya Raja",
  "Babuaan",
  "Panche Ke Nache Aiha",
  "Aayi Nai Stree 2",
  "Chumma Vicky Vidya Ka Woh Wala Video",
  "Lal Ghagra",
  "Current Payal Dev",
  "Babuni Tere Rang Me",
  "Kamariya Hila Rahi Hai",
  "Zindagi Renuka Panwar",
  "Naseeb",
  "Palangiya Ae Piya",
  "Odhaniya Ae Gori",
  "Pyar Mohabbat Jindabad",
  "Maiya Ke Aarti",
  "Bolbam Trending Song",
  "Rusa Na Kareja",
  "Bhojpuriya Raja Title Song",
  "Kaisan Piyawa Ke Charitar Ba 2.0",
  "Dhibari Me Rahue Na Tel",
  "Doli Chadh Ke Dulhin Sasurar Chalali",
  "Tumsa Koi Pyara Bhojpuri",
  "Lut Gaye Bhojpuri",
  "Barish Ban Jana Bhojpuri",
  "Chhath Geet Sonu Nigam",
  "Sajanwa Bada Satawela",
  "Piyawa Bada Satawela",
  "Holi Me Udela Gulal",
  "Chaita Ke Bahar",
  "Sawan Me Piya",
  "Mahua Ke Ras",
  "Devra Bhail Deewana",
  "Gorki Ke Chaal",
  "Ganna Ke Ras",
  "Jila Top",
  "Power Star Ke Josh",
  "Bhatar Sunta Ba",
  "Mehandi Rang Layi",
  "Dahej Na Lelim",
  "Hamaar Wala Dance",
];

export const SONGS = titles.map((title, i) => ({
  id: i + 1,
  title,
  artist: "Pawan Singh",
  query: `Pawan Singh ${title} Bhojpuri song`,
}));

export default SONGS;
