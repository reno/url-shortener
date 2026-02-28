import { toBase62, generateId } from '../../src/usecases/url-shortener.usecase';
import { fromBase62 } from '../../src/usecases/url-redirector.usecase';

describe('Core Functions', () => {
  it('test_simple_conversion', () => {
    expect(toBase62(10)).toBe("a");
  });

  it('test_more_complex_conversion', () => {
    expect(toBase62(11157)).toBe("2TX");
  });

  it('test_larger_id_conversion', () => {
    expect(toBase62(2009215674938)).toBe("zn9edcu");
  });

  it('test_uuid_generator', () => {
    const id = generateId();
    expect(typeof id).toBe('number');
  });

  it('test_from_base62', () => {
    expect(fromBase62("zn9edcu")).toBe(2009215674938);
  });

  it('test_simple_conversion_from_base62', () => {
    expect(fromBase62("a")).toBe(10);
  });

  it('test_invalid_hash_from_base62', () => {
    expect(fromBase62("_invalid_hash")).toBe(-1);
  });
});
