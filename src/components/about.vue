<template>
	<div class="about">
		<span>关于下载使用</span>
		<p>输入想要解析的网易云音乐链接, 等待解析完毕后点击按钮即可进行下载.</p>
		<p>点击下载后会执行打包和下载程序, 需要一些时间, 一般情况音质越高需要的时间越久</p>
		<p>如果长时间没有反应请按F12打开开发者工具检查是否有报错并提交<a href="https://github.com/sooooooooooooooooootheby/Netease_analyze/issues">Issues</a></p>
		<br />
		<span>关于站点</span>
		<p>
			本站点所使用的API基于
			<a href="https://github.com/Suxiaoqinx/Netease_url" target="_black">苏晓晴的Netease_url</a>
			&
			<a href="https://github.com/sooooooooooooooooootheby/NeteaseCloudMusicApi" target="_black">NeteaseCloudMusicApi</a>
		</p>
        <p>本站点仅提供基础的解析服务, 并不会以任何方式方法储存媒体文件</p>
        <p>如有侵权, 请根据下方信息联系站点作者</p>
		<br />
		<span>站点作者信息</span>
		<p>我的名字: sooooooooooooooooootheby</p>
		<p>联系我: sooooooooooooooooootheby@gmail.com</p>
		<a href="http://blog.sooooooooooooooooootheby.top/" target="_block">我的博客</a>
	</div>
</template>

<style lang="scss" scoped>
.about {
	margin-top: 32px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	span {
		font-size: 1.1rem;
		font-weight: bold;
	}
	p {
		line-height: 1.6rem;
	}
}
@media screen and (max-width: 992px) {
	.about {
		width: calc(100vw - 40px);
		padding: 0 20px;
	}
}
</style>
