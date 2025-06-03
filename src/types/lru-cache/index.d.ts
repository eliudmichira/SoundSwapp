// Type definitions for lru-cache
// Project: https://github.com/isaacs/node-lru-cache
// Based on @types/lru-cache

declare module 'lru-cache' {
  namespace LRUCache {
    interface Options<K, V> {
      max?: number;
      maxAge?: number;
      length?: (value: V, key: K) => number;
      dispose?: (key: K, value: V) => void;
      stale?: boolean;
      noDisposeOnSet?: boolean;
      updateAgeOnGet?: boolean;
      ttl?: number;
      allowStale?: boolean;
      ttlResolution?: number;
      ttlAutopurge?: boolean;
      maxSize?: number;
      sizeCalculation?: (value: V, key: K) => number;
      fetchMethod?: (key: K, staleValue?: V, options?: Options<K, V>) => Promise<V>;
      noDeleteOnFetchRejection?: boolean;
    }
  }

  class LRUCache<K = any, V = any> {
    constructor(options?: number | LRUCache.Options<K, V>);
    set(key: K, value: V, maxAge?: number): boolean;
    get(key: K): V | undefined;
    peek(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    keys(): K[];
    values(): V[];
    reset(): void;
    length: number;
    itemCount: number;
    forEach<T = this>(callbackFn: (this: T, value: V, key: K, cache: this) => void, thisArg?: T): void;
    rforEach<T = this>(callbackFn: (this: T, value: V, key: K, cache: this) => void, thisArg?: T): void;
    dump(): Array<{ k: K, v: V, e?: number }>;
    load(cacheEntries: Array<{ k: K, v: V, e?: number }>): void;
    prune(): boolean;
  }

  export = LRUCache;
} 