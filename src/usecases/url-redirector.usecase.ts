import { UrlRepository } from '../domain/repositories/url.repository';

export class UrlRedirector {
  constructor(private readonly repo: UrlRepository) { }

  async perform(hash: string): Promise<string> {
    const key = fromBase62(hash);
    if (key === -1) {
      throw new Error("Invalid hash.");
    }

    const longUrl = await this.repo.getLongUrl(key);
    if (longUrl) {
      return longUrl;
    }

    throw new Error("Invalid hash.");
  }
}

export function fromBase62(hash: string): number {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = hash.length;
  let key = 0;

  for (let i = 0; i < length; i++) {
    const char = hash[length - 1 - i];
    if (!char.match(/[a-zA-Z0-9]/)) {
      return -1;
    }

    const num = chars.indexOf(char);
    if (num === -1) return -1;

    key += num * Math.pow(62, i);
  }

  if (key < 0) return -1;
  return key;
}
