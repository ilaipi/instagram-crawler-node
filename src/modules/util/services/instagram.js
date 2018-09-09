const p = e => {
  var t, n = [];
  for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1)
    n[t] = 0;
  var r = 8 * e.length;
  for (t = 0; t < r; t += 8)
    n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
  return n;
};

const i = (e, t) => {
  var n = (65535 & e) + (65535 & t);
  return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
};

const a = (e, t, n, r, o, a) => {
  let u, c;
  return i((u = i(i(t, e), i(r, a))) << (c = o) | u >>> 32 - c, n);
};

const u = (e, t, n, r, o, i, u) => {
  return a(t & n | ~t & r, e, t, o, i, u);
};

const c = (e, t, n, r, o, i, u) => {
  return a(t & r | n & ~r, e, t, o, i, u);
};

const s = (e, t, n, r, o, i, u) => {
  return a(t ^ n ^ r, e, t, o, i, u);
};

const l = (e, t, n, r, o, i, u) => {
  return a(n ^ (t | ~r), e, t, o, i, u);
};

const d = (e, t) => {
  var n, r, o, a, d;
  e[t >> 5] |= 128 << t % 32,
  e[14 + (t + 64 >>> 9 << 4)] = t;
  var f = 1732584193, p = -271733879, g = -1732584194, b = 271733878;
  for (n = 0; n < e.length; n += 16)
    r = f,
    o = p,
    a = g,
    d = b,
    p = l(p = l(p = l(p = l(p = s(p = s(p = s(p = s(p = c(p = c(p = c(p = c(p = u(p = u(p = u(p = u(p, g = u(g, b = u(b, f = u(f, p, g, b, e[n], 7, -680876936), p, g, e[n + 1], 12, -389564586), f, p, e[n + 2], 17, 606105819), b, f, e[n + 3], 22, -1044525330), g = u(g, b = u(b, f = u(f, p, g, b, e[n + 4], 7, -176418897), p, g, e[n + 5], 12, 1200080426), f, p, e[n + 6], 17, -1473231341), b, f, e[n + 7], 22, -45705983), g = u(g, b = u(b, f = u(f, p, g, b, e[n + 8], 7, 1770035416), p, g, e[n + 9], 12, -1958414417), f, p, e[n + 10], 17, -42063), b, f, e[n + 11], 22, -1990404162), g = u(g, b = u(b, f = u(f, p, g, b, e[n + 12], 7, 1804603682), p, g, e[n + 13], 12, -40341101), f, p, e[n + 14], 17, -1502002290), b, f, e[n + 15], 22, 1236535329), g = c(g, b = c(b, f = c(f, p, g, b, e[n + 1], 5, -165796510), p, g, e[n + 6], 9, -1069501632), f, p, e[n + 11], 14, 643717713), b, f, e[n], 20, -373897302), g = c(g, b = c(b, f = c(f, p, g, b, e[n + 5], 5, -701558691), p, g, e[n + 10], 9, 38016083), f, p, e[n + 15], 14, -660478335), b, f, e[n + 4], 20, -405537848), g = c(g, b = c(b, f = c(f, p, g, b, e[n + 9], 5, 568446438), p, g, e[n + 14], 9, -1019803690), f, p, e[n + 3], 14, -187363961), b, f, e[n + 8], 20, 1163531501), g = c(g, b = c(b, f = c(f, p, g, b, e[n + 13], 5, -1444681467), p, g, e[n + 2], 9, -51403784), f, p, e[n + 7], 14, 1735328473), b, f, e[n + 12], 20, -1926607734), g = s(g, b = s(b, f = s(f, p, g, b, e[n + 5], 4, -378558), p, g, e[n + 8], 11, -2022574463), f, p, e[n + 11], 16, 1839030562), b, f, e[n + 14], 23, -35309556), g = s(g, b = s(b, f = s(f, p, g, b, e[n + 1], 4, -1530992060), p, g, e[n + 4], 11, 1272893353), f, p, e[n + 7], 16, -155497632), b, f, e[n + 10], 23, -1094730640), g = s(g, b = s(b, f = s(f, p, g, b, e[n + 13], 4, 681279174), p, g, e[n], 11, -358537222), f, p, e[n + 3], 16, -722521979), b, f, e[n + 6], 23, 76029189), g = s(g, b = s(b, f = s(f, p, g, b, e[n + 9], 4, -640364487), p, g, e[n + 12], 11, -421815835), f, p, e[n + 15], 16, 530742520), b, f, e[n + 2], 23, -995338651), g = l(g, b = l(b, f = l(f, p, g, b, e[n], 6, -198630844), p, g, e[n + 7], 10, 1126891415), f, p, e[n + 14], 15, -1416354905), b, f, e[n + 5], 21, -57434055), g = l(g, b = l(b, f = l(f, p, g, b, e[n + 12], 6, 1700485571), p, g, e[n + 3], 10, -1894986606), f, p, e[n + 10], 15, -1051523), b, f, e[n + 1], 21, -2054922799), g = l(g, b = l(b, f = l(f, p, g, b, e[n + 8], 6, 1873313359), p, g, e[n + 15], 10, -30611744), f, p, e[n + 6], 15, -1560198380), b, f, e[n + 13], 21, 1309151649), g = l(g, b = l(b, f = l(f, p, g, b, e[n + 4], 6, -145523070), p, g, e[n + 11], 10, -1120210379), f, p, e[n + 2], 15, 718787259), b, f, e[n + 9], 21, -343485551),
    f = i(f, r),
    p = i(p, o),
    g = i(g, a),
    b = i(b, d);
  return [f, p, g, b];
};

const g = e => {
  var t, n, r = "";
  for (n = 0; n < e.length; n += 1) {
    t = e.charCodeAt(n),
    r += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
  }
  return r;
};

/**
 * 78a9fdf2b810df2fd551e60cb7f38ca0:{"id":"1991303091","first":12,"after":"AQBruLdMXmmlqMPpKCAhMWZwalpjW3KdMwyjFAzM7-_tJ9QI_5tb_gaUw9I07-ArqPCjH4BilGe7FE0ZOmDuuUP-V652KRgRWnU5Oy2-Mcc1cw"}
 */
const m = e => {
  const esc = unescape(encodeURIComponent(e));
  const arr = d(p(esc), esc.length * 8);
  var t, n = "", r = 32 * arr.length;
  for (t = 0; t < r; t += 8) {
    n += String.fromCharCode(arr[t >> 5] >>> t % 32 & 255);
  }
  return g(n);
};

export { m };

export const name = 'instagramHelper';
