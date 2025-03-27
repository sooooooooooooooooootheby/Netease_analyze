import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    modules: ["@nuxt/icon"],

    vite: {
        plugins: [tailwindcss()],
    },

    css: ["~/assets/main.css"],

    app: {
        head: {
            title: "网易云无损解析",
            htmlAttrs: {
                lang: "zh-cn",
            },
            meta: [
                { name: "description", content: "一个网易云无损解析站点" },
                { name: "viewport", content: "width=device-width, initial-scale=1.0" }
            ],
            link: [{ rel: "icon", type: "image/x-icon", href: "/logo_small.webp" }],
        },
    },

    runtimeConfig: {
        cookie: process.env.COOKIE,
    },

    nitro: {
        preset: "node-server",
        esbuild: {
            options: {
                target: "esnext",
            },
        },
    },

    imports: {
        dirs: ["types/*.ts"],
    },
});
