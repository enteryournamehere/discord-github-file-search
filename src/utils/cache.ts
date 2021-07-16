import { SearchResults } from "./classes";

export function store(key: string, value: SearchResults) {
    cache[key] = value;
}

export function retrieve(key: string) {
    return cache[key];
}

export function forget(key: string) {
    delete cache[key];
}

const cache = {};
