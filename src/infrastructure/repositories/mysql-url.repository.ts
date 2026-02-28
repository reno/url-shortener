import { UrlRepository, UrlRecord } from '../../domain/repositories/url.repository';
import mysql from 'mysql2/promise';

export class MysqlUrlRepository implements UrlRepository {
  private pool: mysql.Pool;

  constructor(connectionUri: string) {
    this.pool = mysql.createPool(connectionUri);
  }

  async add(id: number, longUrl: string, hash: string): Promise<void> {
    await this.pool.execute(
      'INSERT INTO urls (id, longUrl, hash) VALUES (?, ?, ?)',
      [id, longUrl, hash]
    );
  }

  async list(): Promise<UrlRecord[]> {
    const [rows] = await this.pool.execute('SELECT id, longUrl, hash FROM urls');
    return rows as UrlRecord[];
  }

  async findByLongUrl(longUrl: string): Promise<string | null> {
    const [rows]: any = await this.pool.execute(
      'SELECT hash FROM urls WHERE longUrl = ? LIMIT 1',
      [longUrl]
    );
    if (rows && rows.length > 0) {
      return rows[0].hash;
    }
    return null;
  }

  async getLongUrl(key: number): Promise<string | null> {
    const [rows]: any = await this.pool.execute(
      'SELECT longUrl FROM urls WHERE id = ? LIMIT 1',
      [key]
    );
    if (rows && rows.length > 0) {
      return rows[0].longUrl;
    }
    return null;
  }
}
