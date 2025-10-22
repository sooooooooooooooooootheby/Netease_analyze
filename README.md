# ！声明 ！

本项目为开源软件，遵循MIT许可证。任何个人或组织均可自由使用、修改和分发本项目的源代码。然而，我们明确声明，本项目及其任何衍生作品不得用于任何商业或付费项目。任何违反此声明的行为都将被视为对本项目许可证的侵犯。我们鼓励大家在遵守开源精神和许可证的前提下，积极贡献和分享代码。

# Netease_analyze

这是一个网易云无损解析站点, 因为我发现很多解析网站都没有批量下载的功能, 索性我自己写了一个.

之前有一个旧版本的是纯vue前端的, 通过调用 [Netease_url](https://github.com/Suxiaoqinx/Netease_url) & [NeteaseCloudMusicApi](https://github.com/sooooooooooooooooootheby/NeteaseCloudMusicApi) 两个项目的接口实现批量下载歌单歌曲.

但是因为接口都部署在服务器上, 不是很好维护, 所以我花了一点时间研究了一下源码移植出来使用 nuxt 打包到一起.

后端接口代码位于`/server/api`下.

## 部署

本地部署

```bash
git clone https://github.com/sooooooooooooooooootheby/Netease_analyze.git

cd Netease_analyze

npm i

npm run dev
```

设置环境变量

在根目录新建一个`.env`文件, 填入黑胶会员账号的cookie.

```
COOKIE="MUSIC_U=你获取到的MUSIC_U值;appver=8.9.75;"
```

# 感谢以下项目

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=Suxiaoqinx&repo=Netease_url)](https://github.com/Suxiaoqinx/Netease_url)

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=Binaryify&repo=NeteaseCloudMusicApi)](https://github.com/Binaryify/NeteaseCloudMusicApi)
