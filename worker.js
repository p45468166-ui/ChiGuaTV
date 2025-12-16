// Cloudflare Workers 入口文件
// 重构自原有的 Express 应用，适配 Cloudflare Workers 环境

// 导入依赖
import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 默认接口配置
const DEFAULT_SITES = [
    { key: "ffzy", name: "非凡影视", api: "https://api.ffzyapi.com/api.php/provide/vod", active: true },
    { key: "bfzy", name: "暴风资源", api: "https://bfzyapi.com/api.php/provide/vod", active: true },
    { key: "dyttzy", name: "电影天堂", api: "http://caiji.dyttzyapi.com/api.php/provide/vod", active: true },
    { key: "tyyszy", name: "天涯资源", api: "https://tyyszy.com/api.php/provide/vod", active: true },
    { key: "zy360", name: "360资源", api: "https://360zy.com/api.php/provide/vod", active: true },
    { key: "maotaizy", name: "茅台资源", api: "https://caiji.maotaizy.cc/api.php/provide/vod", active: true },
    { key: "wolong", name: "卧龙资源", api: "https://wolongzyw.com/api.php/provide/vod", active: true },
    { key: "jisu", name: "极速资源", api: "https://jszyapi.com/api.php/provide/vod", active: true },
    { key: "dbzy", name: "豆瓣资源", api: "https://dbzy.tv/api.php/provide/vod", active: true },
    { key: "mozhua", name: "魔爪资源", api: "https://mozhuazy.com/api.php/provide/vod", active: true },
    { key: "mdzy", name: "魔都资源", api: "https://www.mdzyapi.com/api.php/provide/vod", active: true },
    { key: "zuid", name: "最大资源", api: "https://api.zuidapi.com/api.php/provide/vod", active: true },
    { key: "yinghua", name: "樱花资源", api: "https://m3u8.apiyhzy.com/api.php/provide/vod", active: true },
    { key: "wujin", name: "无尽资源", api: "https://api.wujinapi.me/api.php/provide/vod", active: true },
    { key: "wwzy", name: "旺旺短剧", api: "https://wwzy.tv/api.php/provide/vod", active: true },
    { key: "ikun", name: "iKun资源", api: "https://ikunzyapi.com/api.php/provide/vod", active: true },
    { key: "lzi", name: "量子资源", api: "https://cj.lziapi.com/api.php/provide/vod", active: true },
    { key: "bdzy", name: "百度资源", api: "https://api.apibdzy.com/api.php/provide/vod", active: true },
    { key: "hongniuzy", name: "红牛资源", api: "https://www.hongniuzy2.com/api.php/provide/vod", active: true },
    { key: "xinlangaa", name: "新浪资源", api: "https://api.xinlangapi.com/xinlangapi.php/provide/vod", active: true },
    { key: "ckzy", name: "CK资源", api: "https://ckzy.me/api.php/provide/vod", active: true },
    { key: "ukuapi", name: "U酷资源", api: "https://api.ukuapi.com/api.php/provide/vod", active: true },
    { key: "1080zyk", name: "1080资源", api: "https://api.1080zyku.com/inc/apijson.php/", active: true },
    { key: "hhzyapi", name: "豪华资源", api: "https://hhzyapi.com/api.php/provide/vod", active: true },
    { key: "subocaiji", name: "速博资源", api: "https://subocaiji.com/api.php/provide/vod", active: true },
    { key: "p2100", name: "飘零资源", api: "https://p2100.net/api.php/provide/vod", active: true },
    { key: "aqyzy", name: "爱奇艺", api: "https://iqiyizyapi.com/api.php/provide/vod", active: true },
    { key: "yzzy", name: "优质资源", api: "https://api.yzzy-api.com/inc/apijson.php", active: true },
    { key: "myzy", name: "猫眼资源", api: "https://api.maoyanapi.top/api.php/provide/vod", active: true },
    { key: "rycj", name: "如意资源", api: "https://cj.rycjapi.com/api.php/provide/vod", active: true },
    { key: "jinyingzy", name: "金鹰点播", api: "https://jinyingzy.com/api.php/provide/vod", active: true },
    { key: "guangsuapi", name: "光速资源", api: "https://api.guangsuapi.com/api.php/provide/vod", active: true }
];

// 默认数据库结构
const DEFAULT_DB = {
    sites: DEFAULT_SITES,
    users: [],
    favorites: [],
    history: []
};

// 使用内存存储代替 KV 存储（开发环境）
let memoryDB = DEFAULT_DB;

// 密码哈希函数
function hashPassword(password) {
    const salt = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    return crypto.subtle.digest('SHA-256', data).then(hash => {
        return {
            salt,
            hash: Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
        };
    });
}

// 密码验证函数
function verifyPassword(password, salt, hash) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    return crypto.subtle.digest('SHA-256', data).then(verifyHash => {
        const verifyHashStr = Array.from(new Uint8Array(verifyHash)).map(b => b.toString(16).padStart(2, '0')).join('');
        return verifyHashStr === hash;
    });
}

// 生成认证token
async function generateToken(username) {
    const encoder = new TextEncoder();
    const data = encoder.encode(username + Date.now());
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 获取数据库
async function getDB() {
    return memoryDB;
}

// 保存数据库
async function saveDB(db) {
    memoryDB = db;
}

// CORS中间件
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 注册API
router.post('/api/register', async (request) => {
    try {
        const { username, password } = await request.json();
        
        if (!username || !password) {
            return new Response(JSON.stringify({ success: false, message: '用户名和密码不能为空' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 400
            });
        }
        
        if (password.length < 6) {
            return new Response(JSON.stringify({ success: false, message: '密码长度不能少于6个字符' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 400
            });
        }
        
        const db = await getDB();
        
        // 检查用户名是否已存在
        if (db.users.find(user => user.username === username)) {
            return new Response(JSON.stringify({ success: false, message: '用户名已存在' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 400
            });
        }
        
        // 创建新用户
        const { salt, hash } = await hashPassword(password);
        const newUser = {
            username,
            salt,
            hash,
            createdAt: new Date().toISOString()
        };
        
        db.users.push(newUser);
        await saveDB(db);
        
        return new Response(JSON.stringify({ success: true, message: '注册成功' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '注册失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 登录API
router.post('/api/login', async (request) => {
    try {
        const { username, password } = await request.json();
        
        if (!username || !password) {
            return new Response(JSON.stringify({ success: false, message: '用户名和密码不能为空' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 400
            });
        }
        
        const db = await getDB();
        const user = db.users.find(u => u.username === username);
        
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: '用户名或密码错误' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        if (!(await verifyPassword(password, user.salt, user.hash))) {
            return new Response(JSON.stringify({ success: false, message: '用户名或密码错误' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 生成token
        const token = await generateToken(username);
        
        return new Response(JSON.stringify({ success: true, message: '登录成功', token }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '登录失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 简单的认证中间件
async function authenticate(request) {
    // 对于登录注册页面和静态资源，不需要认证
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path === '/login.html' || path === '/register.html' || path.startsWith('/api/login') || path.startsWith('/api/register')) {
        return;
    }
    
    // 从请求头获取token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    
    // 简单的token验证
    if (token) {
        return;
    }
    
    // 对于API请求，返回401
    if (path.startsWith('/api/')) {
        return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 401
        });
    }
    
    // 对于其他页面，重定向到登录页面
    return new Response(null, {
        status: 302,
        headers: {
            Location: '/login.html',
            ...corsHeaders
        }
    });
}

// 测速接口
router.get('/api/check', authenticate, async (request) => {
    try {
        const { key } = request.query;
        const db = await getDB();
        const site = db.sites.find(s => s.key === key);
        
        if (!site) {
            return new Response(JSON.stringify({ latency: 9999 }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        const start = Date.now();
        try {
            // 尝试请求该接口的首页（只请求一页，极简模式）
            await fetch(`${site.api}?ac=list&pg=1`, { timeout: 3000 });
            const latency = Date.now() - start;
            return new Response(JSON.stringify({ latency }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (e) {
            return new Response(JSON.stringify({ latency: 9999 }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    } catch (e) {
        return new Response(JSON.stringify({ latency: 9999 }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
});

// 热门接口
router.get('/api/hot', authenticate, async (request) => {
    try {
        const db = await getDB();
        const sites = db.sites.filter(s => ['ffzy', 'bfzy', 'lzi', 'dbzy'].includes(s.key));
        
        for (const site of sites) {
            try {
                const response = await fetch(`${site.api}?ac=list&pg=1&h=24&out=json`, { timeout: 3000 });
                const data = await response.json();
                const list = data.list || data.data;
                if (list && list.length > 0) {
                    return new Response(JSON.stringify({ list: list.slice(0, 12) }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
            } catch (e) {
                continue;
            }
        }
        
        return new Response(JSON.stringify({ list: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ list: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
});

// 搜索接口
router.get('/api/search', authenticate, async (request) => {
    try {
        const { wd } = request.query;
        if (!wd) {
            return new Response(JSON.stringify({ list: [] }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        const db = await getDB();
        const sites = db.sites.filter(s => s.active);
        
        const promises = sites.map(async (site) => {
            try {
                const response = await fetch(`${site.api}?ac=list&wd=${encodeURIComponent(wd)}&out=json`, { timeout: 6000 });
                const data = await response.json();
                const list = data.list || data.data;
                if (list && Array.isArray(list)) {
                    return list.map(item => ({
                        ...item, 
                        site_key: site.key, 
                        site_name: site.name,
                        latency: 0 
                    }));
                }
            } catch (e) {
                // 忽略错误，继续处理其他站点
            }
            return [];
        });
        
        const results = await Promise.all(promises);
        return new Response(JSON.stringify({ list: results.flat() }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ list: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
});

// 详情接口
router.get('/api/detail', authenticate, async (request) => {
    try {
        const { site_key, id } = request.query;
        const db = await getDB();
        const targetSite = db.sites.find(s => s.key === site_key);
        
        if (!targetSite) {
            return new Response(JSON.stringify({ error: "Site not found" }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 404
            });
        }
        
        const response = await fetch(`${targetSite.api}?ac=detail&ids=${id}&out=json`, { timeout: 6000 });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Source Error" }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 管理员登录
router.post('/api/admin/login', async (request) => {
    const { password } = await request.json();
    return new Response(JSON.stringify({ success: password === "admin" }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
});

// 获取站点配置
router.get('/api/admin/sites', authenticate, async (request) => {
    const db = await getDB();
    return new Response(JSON.stringify(db.sites), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
});

// 更新站点配置
router.post('/api/admin/sites', authenticate, async (request) => {
    try {
        const sites = await request.json();
        const db = await getDB();
        db.sites = sites;
        await saveDB(db);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// === 用户收藏功能 ===

// 获取用户收藏列表
router.get('/api/favorites', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        
        const db = await getDB();
        const favorites = db.favorites.filter(item => item.username === username);
        
        return new Response(JSON.stringify({ success: true, favorites }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '获取收藏列表失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 添加收藏
router.post('/api/favorites', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        const { item } = await request.json();
        
        const db = await getDB();
        
        // 检查是否已经收藏
        const existing = db.favorites.find(fav => fav.username === username && fav.item.name === item.name);
        if (existing) {
            return new Response(JSON.stringify({ success: false, message: '已经收藏过该内容' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 400
            });
        }
        
        // 添加收藏
        const favorite = {
            id: crypto.randomUUID(),
            username,
            item,
            createdAt: new Date().toISOString()
        };
        
        db.favorites.push(favorite);
        await saveDB(db);
        
        return new Response(JSON.stringify({ success: true, favorite }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '添加收藏失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 删除收藏
router.delete('/api/favorites/:id', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        const { id } = request.params;
        const db = await getDB();
        
        // 删除收藏
        const initialLength = db.favorites.length;
        db.favorites = db.favorites.filter(fav => fav.id !== id);
        
        if (db.favorites.length < initialLength) {
            await saveDB(db);
            return new Response(JSON.stringify({ success: true, message: '取消收藏成功' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: '收藏不存在' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 404
            });
        }
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '取消收藏失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// === 用户历史记录功能 ===

// 获取用户历史记录
router.get('/api/history', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        
        const db = await getDB();
        const history = db.history.filter(item => item.username === username)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        return new Response(JSON.stringify({ success: true, history }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '获取历史记录失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 添加历史记录
router.post('/api/history', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        const { item, progress = 0 } = await request.json();
        
        const db = await getDB();
        
        // 检查是否已经存在历史记录
        const existingIndex = db.history.findIndex(hist => hist.username === username && hist.item.name === item.name);
        
        if (existingIndex >= 0) {
            // 更新现有历史记录
            db.history[existingIndex] = {
                ...db.history[existingIndex],
                progress,
                updatedAt: new Date().toISOString()
            };
        } else {
            // 添加新历史记录
            const historyItem = {
                id: crypto.randomUUID(),
                username,
                item,
                progress,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            db.history.push(historyItem);
        }
        
        await saveDB(db);
        
        return new Response(JSON.stringify({ success: true, message: '历史记录已更新' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '更新历史记录失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// 清除用户历史记录
router.delete('/api/history', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        const db = await getDB();
        
        // 清除该用户的所有历史记录
        db.history = db.history.filter(hist => hist.username !== username);
        await saveDB(db);
        
        return new Response(JSON.stringify({ success: true, message: '历史记录已清除' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, message: '清除历史记录失败' }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500
        });
    }
});

// === 影视推荐算法 ===

// 获取推荐内容
router.get('/api/recommend', authenticate, async (request) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ success: false, message: '请先登录' }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
                status: 401
            });
        }
        
        // 从token中提取用户名（简化处理，实际应使用JWT解析）
        const username = token.substring(0, 10);
        const db = await getDB();
        
        // 获取用户历史记录
        const userHistory = db.history.filter(item => item.username === username);
        
        // 简单的推荐算法
        let recommendList = [];
        
        try {
            // 尝试获取热门内容
            const hotUrl = `${db.sites[0].api}?ac=list&pg=1&h=24&out=json`;
            const response = await fetch(hotUrl, { timeout: 3000 });
            const data = await response.json();
            const list = data.list || data.data || [];
            recommendList = list.slice(0, 12);
        } catch (fetchError) {
            // 如果获取热门内容失败，返回空列表
            recommendList = [];
        }
        
        return new Response(JSON.stringify({ success: true, list: recommendList }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (e) {
        // 处理其他错误，返回空列表
        return new Response(JSON.stringify({ success: true, list: [] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
});

// 静态文件处理
router.get('/*', async (request) => {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 默认返回 index.html
    if (path === '/') {
        return fetch(new URL('/index.html', request.url));
    }
    
    // 其他静态文件
    return fetch(new URL(path, request.url));
});

// 处理 OPTIONS 请求
router.options('*', () => {
    return new Response(null, {
        headers: corsHeaders
    });
});

// 404 处理
router.all('*', () => {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
});

// 主处理函数
export default {
    async fetch(request, env, ctx) {
        // 调用路由器处理请求
        return router.handle(request, env, ctx);
    },
};
