<template>
	<div class="dock">
		<span class="title">
			<Icon icon="simple-icons:neteasecloudmusic" class="icon" />
		</span>
	</div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
	components: {
		Icon,
	},
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.dock {
	width: calc(100vw - 64px);
	height: 64px;
	padding-left: 64px;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	.title {
		display: flex;
		align-items: center;
        font-weight: bold;
		.icon {
            font-size: 2rem;
            margin-right: 6px;
		}
	}
}
@media screen and (max-width: 992px) {
	.dock {
		padding-left: 18px;
	}
}
</style>
