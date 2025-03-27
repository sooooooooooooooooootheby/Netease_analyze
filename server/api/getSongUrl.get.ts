import { randomInt, createHash, createCipheriv } from "node:crypto";
import { url } from "~/types";

function hexDigest(data: Buffer): string {
    return data.toString("hex");
}

function hashDigest(text: string): Buffer {
    return createHash("md5").update(text, "utf8").digest();
}

function hashHexDigest(text: string): string {
    return hexDigest(hashDigest(text));
}

function parseCookie(text = ""): Record<string, string> {
    return text.split(";").reduce((acc, item) => {
        const [key, value] = item.trim().split("=");
        return key ? { ...acc, [key]: value || "" } : acc;
    }, {});
}

async function url_v1(id: string, level: string, cookie: Record<string, string>) {
    const url = "https://interface3.music.163.com/eapi/song/enhance/player/url/v1";
    const AES_KEY = Buffer.from("e82ckenh8dichen8", "utf8");

    // 构造请求参数
    const config = {
        os: "pc",
        appver: "",
        osver: "",
        deviceId: "pyncm!",
        requestId: randomInt(20_000_000, 30_000_000).toString(),
    };

    const payload: Record<string, any> = {
        ids: [id],
        level,
        encodeType: "flac",
        header: JSON.stringify(config),
    };

    if (level === "sky") payload.immerseType = "c51";

    // 生成加密参数
    const apiPath = new URL(url).pathname.replace("/eapi/", "/api/");
    const digest = hashHexDigest(`nobody${apiPath}use${JSON.stringify(payload)}md5forencrypt`);
    const params = `${apiPath}-36cd479b6b5-${JSON.stringify(payload)}-36cd479b6b5-${digest}`;

    // AES 加密
    const cipher = createCipheriv("aes-128-ecb", AES_KEY, null);
    const encryptedParams = Buffer.concat([cipher.update(params, "utf8"), cipher.final()]).toString("hex");

    // 构造请求
    const mergedCookies = {
        os: "pc",
        appver: "",
        osver: "",
        deviceId: "pyncm!",
        ...cookie,
    };

    return await $fetch(url, {
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36 Chrome/91.0.4472.164 NeteaseMusicDesktop/2.10.2.200154",
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: Object.entries(mergedCookies)
                .map(([k, v]) => `${k}=${v}`)
                .join("; "),
        },
        body: `params=${encryptedParams}`,
    });
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { id, level } = getQuery(event);
    if (!id || !level) {
        throw createError({
            statusCode: 400,
            message: "Missing id or level parameter",
        });
    }

    try {
        const cookies = parseCookie(config.cookie);
        const result: any = await url_v1(id.toString(), level.toString(), cookies);

        const url: url = {
            code: result.code,
            url: result.data[0].url,
            size: result.data[0].size,
            type: result.data[0].type,
            time: result.data[0].time,
        };

        $fetch(`https://api.s22y.moe/count/get?name=neteasy`);

        return url;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: (error as Error).message || "Internal server error",
        });
    }
});
