module.exports = {
    apps: [
        {
            name: "Netease_analyze",
            port: "3002",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
        },
    ],
};
