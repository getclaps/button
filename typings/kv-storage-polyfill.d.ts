declare module 'kv-storage-polyfill' {
  export type AllowedKey = string | number | Date | BufferSource | AllowedKey[];
  export type Key = string | number | Date | ArrayBuffer | Key[];
  export class StorageArea {
    constructor(name: string);
    set<T = any>(key: AllowedKey, value: T): Promise<void> ;
    get<T = any>(key: AllowedKey): Promise<T> ;
    delete(key: AllowedKey): Promise<void> ;
    clear(): Promise<void> ;
    keys(): AsyncIterableIterator<Key>;
    values<T = any>(): AsyncIterableIterator<T>;
    entries<T = any>(): AsyncIterableIterator<[Key, T]>;
    backingStore(): IDBObjectStore;
  }
}