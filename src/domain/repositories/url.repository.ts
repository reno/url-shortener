export interface UrlRecord {
  id: number;
  hash: string;
  longUrl: string;
}

export interface UrlRepository {
  add(id: number, longUrl: string, hash: string): Promise<void>;
  list(): Promise<UrlRecord[]>;
  findByLongUrl(longUrl: string): Promise<string | null>;
  getLongUrl(key: number): Promise<string | null>;
}
