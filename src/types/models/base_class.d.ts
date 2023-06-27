
export interface BaseClass {
    meta?: Meta;
}

export interface Meta {
    version: number;
    lastUpdated: number;
    createdAt?: number;
    deleted: boolean;
}
const initialMeta: Meta = {
    version: 0,
    deleted: false,
};
