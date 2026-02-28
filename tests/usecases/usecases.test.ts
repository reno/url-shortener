import { UrlShortener } from '../../src/usecases/url-shortener.usecase';
import { UrlRedirector } from '../../src/usecases/url-redirector.usecase';
import { InMemoryUrlRepository } from '../../src/infrastructure/repositories/in-memory-url.repository';

describe('UseCases', () => {
  it('test_shortener_usecase_for_new_url', async () => {
    const repo = new InMemoryUrlRepository();
    const usecase = new UrlShortener(repo);
    const longUrl = "https://en.wikipedia.org/wiki/Systems_design";

    const hash = await usecase.perform(longUrl);
    expect(hash).toBeTruthy();

    const records = await repo.list();
    const fetchedLongUrl = records[0].longUrl;

    expect(records.length).toBe(1);
    expect(fetchedLongUrl).toBe(longUrl);
  });

  it('test_shortener_usecase_for_existing_url', async () => {
    const repo = new InMemoryUrlRepository();
    const usecase = new UrlShortener(repo);
    const longUrl = "https://en.wikipedia.org/wiki/Systems_design";

    await usecase.perform(longUrl);
    await usecase.perform(longUrl);

    const records = await repo.list();
    const fetchedLongUrl = records[0].longUrl;

    expect(records.length).toBe(1);
    expect(fetchedLongUrl).toBe(longUrl);
  });

  it('test_redirector_use_case', async () => {
    const originalLongUrl = "https://en.wikipedia.org/wiki/Systems_design";
    const hash = "zn9edcu";
    const repo = new InMemoryUrlRepository();

    \    await repo.add(2009215674938, originalLongUrl, hash);

    const usecase = new UrlRedirector(repo);
    const fetchedLongUrl = await usecase.perform(hash);

    expect(fetchedLongUrl).toBe(originalLongUrl);
  });

  it('test_redirector_usecase_invalid_hash', async () => {
    const repo = new InMemoryUrlRepository();
    const usecase = new UrlRedirector(repo);

    await expect(usecase.perform("notavalidhash")).rejects.toThrow();
  });
});
