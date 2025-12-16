# ChiGuaTV
吃瓜视频，吃瓜影视，吃瓜TV



V1.1

更新内容
- 多用户系统 ：实现了用户注册、登录功能，使用token进行身份验证，支持多用户独立使用系统。
- 用户收藏功能 ：

- 实现了添加收藏、获取收藏列表、删除收藏的API
- 前端界面添加了收藏按钮和收藏列表展示
- 支持在播放页面一键收藏/取消收藏
- 用户历史记录功能 ：

- 实现了添加历史记录、获取历史记录、清除历史记录的API
- 前端界面添加了历史记录列表展示
- 支持在播放页面自动更新观看进度
- 播放历史同步功能 ：

- 在视频播放时自动记录播放进度
- 支持在不同设备间同步观看历史
- 影视推荐算法 ：

- 实现了基于热门内容的推荐算法
- 支持根据用户历史记录进行简单的个性化推荐
- 前端界面更新 ：

- 添加了收藏、历史记录、推荐功能的UI组件
- 优化了播放页面的用户体验
- 实现了响应式设计，适配不同设备

# 吃瓜TV Cloudflare Workers 部署指南
## 快速部署步骤
### 1. 环境准备
- 确保安装了 Node.js ≥ 18.0 和 npm ≥ 8.0
- 注册并登录 Cloudflare 账号
### 2. 项目配置 配置 TMDb API Key
1. 编辑 public/index.html 文件，替换为你自己的 TMDb API Key：
   
   ```
   const TMDB_API_KEY = "你的TMDb 
   API Key";
   ```
2. 获取 TMDb API Key：
   
   - 访问 TMDb 官网 https://www.themoviedb.org/
   - 注册并登录
   - 进入 API 设置页面
   - 创建 Developer 类型的 API 密钥 配置 Cloudflare Workers
1. 编辑 wrangler.toml 文件，修改 Worker 名称：
   ```
   name = "你的-worker名称"  # 例如：
   chiguatv
   ```
### 3. 本地开发测试
```
npm run dev
```
访问 http://localhost:8787 进行本地测试

### 4. 部署到 Cloudflare Workers
```
npm run deploy
```
### 5. 访问应用
- 前端页面: https://你的-worker名称.workers.dev
- 后台管理: https://你的-worker名称.workers.dev/admin.html (默认密码: admin )
## 功能测试清单
部署后，建议按照以下清单测试所有功能：

- ✅ 注册新用户
- ✅ 登录已有用户
- ✅ 搜索影视内容
- ✅ 播放影视内容
- ✅ 添加/取消收藏
- ✅ 查看历史记录
- ✅ 清除历史记录
- ✅ 查看推荐内容
- ✅ 访问管理后台
## 常见问题排查
1. API 请求失败 ：检查网络连接和 TMDb API Key 是否有效
2. 播放失败 ：尝试切换其他资源源，检查资源站点是否可用
3. 登录失败 ：确保密码长度不少于6个字符
4. 部署失败 ：检查 wrangler.toml 配置，确保 Cloudflare CLI 已登录
## 调试工具
1. 本地日志 ：运行 npm run dev 查看本地日志
2. Cloudflare 日志 ：在 Cloudflare Workers 控制台查看运行日志
3. API 测试 ：使用 curl 或 Postman 测试 API 端点
## 高级配置
1. 自定义资源站点 ：编辑 worker.js 中的 DEFAULT_SITES 数组
2. 修改管理员密码 ：编辑 worker.js 中的管理员登录 API 部分
3. 添加新功能 ：根据开发计划逐步实现更多功能
## 技术支持
如果遇到部署或使用问题，可以：

1. 查看 Cloudflare Workers 文档
2. 检查项目 GitHub Issues
3. 提交新的 Issue 描述问题
祝你部署顺利！🚀
