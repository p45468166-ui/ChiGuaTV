var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-Eh9MLE/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-Eh9MLE/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/itty-router/index.mjs
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: (o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, ...o2, async fetch(e3, ...o3) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
  for (let [a2, c2, i2, l2] of t)
    if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = l2;
      for (let t2 of i2)
        if (null != (s2 = await t2(e3.proxy ?? e3, ...o3)))
          return s2;
    }
} }), "e");
var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var i = o("text/html");
var l = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// worker.js
var router = e();
var DEFAULT_SITES = [
  { key: "ffzy", name: "\u975E\u51E1\u5F71\u89C6", api: "https://api.ffzyapi.com/api.php/provide/vod", active: true },
  { key: "bfzy", name: "\u66B4\u98CE\u8D44\u6E90", api: "https://bfzyapi.com/api.php/provide/vod", active: true },
  { key: "dyttzy", name: "\u7535\u5F71\u5929\u5802", api: "http://caiji.dyttzyapi.com/api.php/provide/vod", active: true },
  { key: "tyyszy", name: "\u5929\u6DAF\u8D44\u6E90", api: "https://tyyszy.com/api.php/provide/vod", active: true },
  { key: "zy360", name: "360\u8D44\u6E90", api: "https://360zy.com/api.php/provide/vod", active: true },
  { key: "maotaizy", name: "\u8305\u53F0\u8D44\u6E90", api: "https://caiji.maotaizy.cc/api.php/provide/vod", active: true },
  { key: "wolong", name: "\u5367\u9F99\u8D44\u6E90", api: "https://wolongzyw.com/api.php/provide/vod", active: true },
  { key: "jisu", name: "\u6781\u901F\u8D44\u6E90", api: "https://jszyapi.com/api.php/provide/vod", active: true },
  { key: "dbzy", name: "\u8C46\u74E3\u8D44\u6E90", api: "https://dbzy.tv/api.php/provide/vod", active: true },
  { key: "mozhua", name: "\u9B54\u722A\u8D44\u6E90", api: "https://mozhuazy.com/api.php/provide/vod", active: true },
  { key: "mdzy", name: "\u9B54\u90FD\u8D44\u6E90", api: "https://www.mdzyapi.com/api.php/provide/vod", active: true },
  { key: "zuid", name: "\u6700\u5927\u8D44\u6E90", api: "https://api.zuidapi.com/api.php/provide/vod", active: true },
  { key: "yinghua", name: "\u6A31\u82B1\u8D44\u6E90", api: "https://m3u8.apiyhzy.com/api.php/provide/vod", active: true },
  { key: "wujin", name: "\u65E0\u5C3D\u8D44\u6E90", api: "https://api.wujinapi.me/api.php/provide/vod", active: true },
  { key: "wwzy", name: "\u65FA\u65FA\u77ED\u5267", api: "https://wwzy.tv/api.php/provide/vod", active: true },
  { key: "ikun", name: "iKun\u8D44\u6E90", api: "https://ikunzyapi.com/api.php/provide/vod", active: true },
  { key: "lzi", name: "\u91CF\u5B50\u8D44\u6E90", api: "https://cj.lziapi.com/api.php/provide/vod", active: true },
  { key: "bdzy", name: "\u767E\u5EA6\u8D44\u6E90", api: "https://api.apibdzy.com/api.php/provide/vod", active: true },
  { key: "hongniuzy", name: "\u7EA2\u725B\u8D44\u6E90", api: "https://www.hongniuzy2.com/api.php/provide/vod", active: true },
  { key: "xinlangaa", name: "\u65B0\u6D6A\u8D44\u6E90", api: "https://api.xinlangapi.com/xinlangapi.php/provide/vod", active: true },
  { key: "ckzy", name: "CK\u8D44\u6E90", api: "https://ckzy.me/api.php/provide/vod", active: true },
  { key: "ukuapi", name: "U\u9177\u8D44\u6E90", api: "https://api.ukuapi.com/api.php/provide/vod", active: true },
  { key: "1080zyk", name: "1080\u8D44\u6E90", api: "https://api.1080zyku.com/inc/apijson.php/", active: true },
  { key: "hhzyapi", name: "\u8C6A\u534E\u8D44\u6E90", api: "https://hhzyapi.com/api.php/provide/vod", active: true },
  { key: "subocaiji", name: "\u901F\u535A\u8D44\u6E90", api: "https://subocaiji.com/api.php/provide/vod", active: true },
  { key: "p2100", name: "\u98D8\u96F6\u8D44\u6E90", api: "https://p2100.net/api.php/provide/vod", active: true },
  { key: "aqyzy", name: "\u7231\u5947\u827A", api: "https://iqiyizyapi.com/api.php/provide/vod", active: true },
  { key: "yzzy", name: "\u4F18\u8D28\u8D44\u6E90", api: "https://api.yzzy-api.com/inc/apijson.php", active: true },
  { key: "myzy", name: "\u732B\u773C\u8D44\u6E90", api: "https://api.maoyanapi.top/api.php/provide/vod", active: true },
  { key: "rycj", name: "\u5982\u610F\u8D44\u6E90", api: "https://cj.rycjapi.com/api.php/provide/vod", active: true },
  { key: "jinyingzy", name: "\u91D1\u9E70\u70B9\u64AD", api: "https://jinyingzy.com/api.php/provide/vod", active: true },
  { key: "guangsuapi", name: "\u5149\u901F\u8D44\u6E90", api: "https://api.guangsuapi.com/api.php/provide/vod", active: true }
];
var DEFAULT_DB = {
  sites: DEFAULT_SITES,
  users: [],
  favorites: [],
  history: []
};
var memoryDB = DEFAULT_DB;
function hashPassword(password) {
  const salt = crypto.randomUUID();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  return crypto.subtle.digest("SHA-256", data).then((hash) => {
    return {
      salt,
      hash: Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("")
    };
  });
}
__name(hashPassword, "hashPassword");
function verifyPassword(password, salt, hash) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  return crypto.subtle.digest("SHA-256", data).then((verifyHash) => {
    const verifyHashStr = Array.from(new Uint8Array(verifyHash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return verifyHashStr === hash;
  });
}
__name(verifyPassword, "verifyPassword");
async function generateToken(username) {
  const encoder = new TextEncoder();
  const data = encoder.encode(username + Date.now());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");
async function getDB() {
  return memoryDB;
}
__name(getDB, "getDB");
async function saveDB(db) {
  memoryDB = db;
}
__name(saveDB, "saveDB");
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
router.post("/api/register", async (request) => {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, message: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ success: false, message: "\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u5C11\u4E8E6\u4E2A\u5B57\u7B26" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }
    const db = await getDB();
    if (db.users.find((user) => user.username === username)) {
      return new Response(JSON.stringify({ success: false, message: "\u7528\u6237\u540D\u5DF2\u5B58\u5728" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }
    const { salt, hash } = await hashPassword(password);
    const newUser = {
      username,
      salt,
      hash,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newUser);
    await saveDB(db);
    return new Response(JSON.stringify({ success: true, message: "\u6CE8\u518C\u6210\u529F" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u6CE8\u518C\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.post("/api/login", async (request) => {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, message: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }
    const db = await getDB();
    const user = db.users.find((u) => u.username === username);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    if (!await verifyPassword(password, user.salt, user.hash)) {
      return new Response(JSON.stringify({ success: false, message: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const token = await generateToken(username);
    return new Response(JSON.stringify({ success: true, message: "\u767B\u5F55\u6210\u529F", token }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u767B\u5F55\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
async function authenticate(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/login.html" || path === "/register.html" || path.startsWith("/api/login") || path.startsWith("/api/register")) {
    return;
  }
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  if (token) {
    return;
  }
  if (path.startsWith("/api/")) {
    return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 401
    });
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login.html",
      ...corsHeaders
    }
  });
}
__name(authenticate, "authenticate");
router.get("/api/check", authenticate, async (request) => {
  try {
    const { key } = request.query;
    const db = await getDB();
    const site = db.sites.find((s2) => s2.key === key);
    if (!site) {
      return new Response(JSON.stringify({ latency: 9999 }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const start = Date.now();
    try {
      await fetch(`${site.api}?ac=list&pg=1`, { timeout: 3e3 });
      const latency = Date.now() - start;
      return new Response(JSON.stringify({ latency }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (e2) {
      return new Response(JSON.stringify({ latency: 9999 }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  } catch (e2) {
    return new Response(JSON.stringify({ latency: 9999 }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
router.get("/api/hot", authenticate, async (request) => {
  try {
    const db = await getDB();
    const sites = db.sites.filter((s2) => ["ffzy", "bfzy", "lzi", "dbzy"].includes(s2.key));
    for (const site of sites) {
      try {
        const response = await fetch(`${site.api}?ac=list&pg=1&h=24&out=json`, { timeout: 3e3 });
        const data = await response.json();
        const list = data.list || data.data;
        if (list && list.length > 0) {
          return new Response(JSON.stringify({ list: list.slice(0, 12) }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      } catch (e2) {
        continue;
      }
    }
    return new Response(JSON.stringify({ list: [] }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ list: [] }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
router.get("/api/search", authenticate, async (request) => {
  try {
    const { wd } = request.query;
    if (!wd) {
      return new Response(JSON.stringify({ list: [] }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const db = await getDB();
    const sites = db.sites.filter((s2) => s2.active);
    const promises = sites.map(async (site) => {
      try {
        const response = await fetch(`${site.api}?ac=list&wd=${encodeURIComponent(wd)}&out=json`, { timeout: 6e3 });
        const data = await response.json();
        const list = data.list || data.data;
        if (list && Array.isArray(list)) {
          return list.map((item) => ({
            ...item,
            site_key: site.key,
            site_name: site.name,
            latency: 0
          }));
        }
      } catch (e2) {
      }
      return [];
    });
    const results = await Promise.all(promises);
    return new Response(JSON.stringify({ list: results.flat() }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ list: [] }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
router.get("/api/detail", authenticate, async (request) => {
  try {
    const { site_key, id } = request.query;
    const db = await getDB();
    const targetSite = db.sites.find((s2) => s2.key === site_key);
    if (!targetSite) {
      return new Response(JSON.stringify({ error: "Site not found" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 404
      });
    }
    const response = await fetch(`${targetSite.api}?ac=detail&ids=${id}&out=json`, { timeout: 6e3 });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ error: "Source Error" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.post("/api/admin/login", async (request) => {
  const { password } = await request.json();
  return new Response(JSON.stringify({ success: password === "admin" }), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
});
router.get("/api/admin/sites", authenticate, async (request) => {
  const db = await getDB();
  return new Response(JSON.stringify(db.sites), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
});
router.post("/api/admin/sites", authenticate, async (request) => {
  try {
    const sites = await request.json();
    const db = await getDB();
    db.sites = sites;
    await saveDB(db);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.get("/api/favorites", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const db = await getDB();
    const favorites = db.favorites.filter((item) => item.username === username);
    return new Response(JSON.stringify({ success: true, favorites }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u83B7\u53D6\u6536\u85CF\u5217\u8868\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.post("/api/favorites", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const { item } = await request.json();
    const db = await getDB();
    const existing = db.favorites.find((fav) => fav.username === username && fav.item.name === item.name);
    if (existing) {
      return new Response(JSON.stringify({ success: false, message: "\u5DF2\u7ECF\u6536\u85CF\u8FC7\u8BE5\u5185\u5BB9" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }
    const favorite = {
      id: crypto.randomUUID(),
      username,
      item,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.favorites.push(favorite);
    await saveDB(db);
    return new Response(JSON.stringify({ success: true, favorite }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u6DFB\u52A0\u6536\u85CF\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.delete("/api/favorites/:id", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const { id } = request.params;
    const db = await getDB();
    const initialLength = db.favorites.length;
    db.favorites = db.favorites.filter((fav) => fav.id !== id);
    if (db.favorites.length < initialLength) {
      await saveDB(db);
      return new Response(JSON.stringify({ success: true, message: "\u53D6\u6D88\u6536\u85CF\u6210\u529F" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: "\u6536\u85CF\u4E0D\u5B58\u5728" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 404
      });
    }
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u53D6\u6D88\u6536\u85CF\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.get("/api/history", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const db = await getDB();
    const history = db.history.filter((item) => item.username === username).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return new Response(JSON.stringify({ success: true, history }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u83B7\u53D6\u5386\u53F2\u8BB0\u5F55\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.post("/api/history", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const { item, progress = 0 } = await request.json();
    const db = await getDB();
    const existingIndex = db.history.findIndex((hist) => hist.username === username && hist.item.name === item.name);
    if (existingIndex >= 0) {
      db.history[existingIndex] = {
        ...db.history[existingIndex],
        progress,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      const historyItem = {
        id: crypto.randomUUID(),
        username,
        item,
        progress,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.history.push(historyItem);
    }
    await saveDB(db);
    return new Response(JSON.stringify({ success: true, message: "\u5386\u53F2\u8BB0\u5F55\u5DF2\u66F4\u65B0" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u66F4\u65B0\u5386\u53F2\u8BB0\u5F55\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.delete("/api/history", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const db = await getDB();
    db.history = db.history.filter((hist) => hist.username !== username);
    await saveDB(db);
    return new Response(JSON.stringify({ success: true, message: "\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u9664" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: false, message: "\u6E05\u9664\u5386\u53F2\u8BB0\u5F55\u5931\u8D25" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
router.get("/api/recommend", authenticate, async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: "\u8BF7\u5148\u767B\u5F55" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401
      });
    }
    const username = token.substring(0, 10);
    const db = await getDB();
    const userHistory = db.history.filter((item) => item.username === username);
    let recommendList = [];
    try {
      const hotUrl = `${db.sites[0].api}?ac=list&pg=1&h=24&out=json`;
      const response = await fetch(hotUrl, { timeout: 3e3 });
      const data = await response.json();
      const list = data.list || data.data || [];
      recommendList = list.slice(0, 12);
    } catch (fetchError) {
      recommendList = [];
    }
    return new Response(JSON.stringify({ success: true, list: recommendList }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e2) {
    return new Response(JSON.stringify({ success: true, list: [] }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
router.get("/*", async (request) => {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/") {
    return fetch(new URL("/index.html", request.url));
  }
  return fetch(new URL(path, request.url));
});
router.options("*", () => {
  return new Response(null, {
    headers: corsHeaders
  });
});
router.all("*", () => {
  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
});
var worker_default = {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Eh9MLE/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Eh9MLE/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
