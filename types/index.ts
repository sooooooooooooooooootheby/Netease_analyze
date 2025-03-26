export interface author {
    id: number;
    name: string;
}

export interface album {
    id: number;
    name: string;
    cover: string;
}

export interface song {
    name: string;
    id: number;
    author: author;
    album: album;
}

export interface creator {
    uid: number;
    avatar: string;
    name: string;
}

export interface playlist {
    code: number;
    name: string;
    coverImage: string;
    songCount: number;
    description: string;
    tags: Array<string>;
    creator: creator;
    list: Array<{ id: number }>;
}

export interface lyric {
    code: number;
    lyric: string;
}

export interface url {
    code: string;
    url: string;
    size: number;
    type: string;
    time: number;
}

export interface download {
    id: number;
    name: string;
    cover: string;
    status: string;
}