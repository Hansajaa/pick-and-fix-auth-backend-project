export interface RedisRepositoryInterface {
  get(dbIndex: number, prefix: string, key: string): Promise<string | null>
  set(dbIndex: number, prefix: string, key: string, value: string): Promise<void>
  delete(dbIndex: number, prefix: string, key: string): Promise<void>
  setWithExpiry(dbIndex: number, prefix: string, key: string, value: string, expiry: number): Promise<void>
}
