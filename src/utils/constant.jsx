export const LOGO =
  "https://fontmeme.com/permalink/250323/0d1731b7e71e9e482a2babcf857d6171.png";

export const USER_AVATAR =
  "https://occ-0-6246-2186.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTZ2zlLdBVC05fsd2YQAR43J6vB1NAUBOOrxt7oaFATxMhtdzlNZ846H3D8TZzooe2-FT853YVYs8p001KVFYopWi4D4NXM.png?r=229";

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + import.meta.env.VITE_TMDB_KEY,
  },
};
export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500/";

export const BG_URL =
  "https://assets.nflxext.com/ffe/siteui/vlv3/f6e7f6df-6973-46ef-b98f-12560d2b3c69/web/IN-en-20250317-TRIFECTA-perspective_26f87873-6014-460d-a6fb-1d96d85ffe5f_large.jpg";

export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
