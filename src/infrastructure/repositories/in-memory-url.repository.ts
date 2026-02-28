import { UrlRepository, UrlRecord } from '../../domain/repositories/url.repository';

export class InMemoryUrlRepository implements UrlRepository {
  private records: Record<number, { hash: string, longUrl: string }> = {};

  async add(id: number, longUrl: string, hash: string): Promise<void> {
    this.records[id] = { hash, longUrl };
  }

  async list(): Promise<UrlRecord[]> {
    return Object.entries(this.records).map(([idStr, value]) => ({
      id: parseInt(idStr, 10),
      hash: value.hash,
      longUrl: value.longUrl
    }));
  }

  async findByLongUrl(longUrl: string): Promise<string | null> {
    const values = Object.values(this.records);
    for (const value of values) {
      if (value.longUrl === longUrl) {
        return value.hash;
      }
    }
    return null;
  }

  async getLongUrl(key: number): Promise<string | null> {
    const record = this.records[key];
    if (record) {
      return record.longUrl;
    }
    return null;
  }
}
