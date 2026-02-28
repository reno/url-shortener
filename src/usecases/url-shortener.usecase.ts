import { UrlRepository } from '../domain/repositories/url.repository';
import crypto from 'crypto';

export class UrlShortener {
  constructor(private readonly repo: UrlRepository) { }

  async perform(longUrl: string): Promise<string> {
    const existingHash = await this.repo.findByLongUrl(longUrl);
    if (existingHash) {
      return existingHash;
    }

    const id = generateId();
    const hash = toBase62(id);
    await this.repo.add(id, longUrl, hash);

    return hash;
  }
}

export function generateId(): number {
  return crypto.randomBytes(3).readUIntBE(0, 3);
}

export function toBase62(num: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let converted = '';
  let current = num;

  if (current === 0) return '0';

  while (Math.floor(current / 62) !== 0) {
    const remainder = current % 62;
    converted += chars[remainder];
    current = Math.floor(current / 62);
  }
  converted += chars[current % 62];

  return converted.split('').reverse().join('');
}
