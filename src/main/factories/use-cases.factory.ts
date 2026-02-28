import { UrlShortener } from '../../usecases/url-shortener.usecase';
import { UrlRedirector } from '../../usecases/url-redirector.usecase';
import { makeRepo } from './repository.factory';

export function makeShortenUsecase(): UrlShortener {
  return new UrlShortener(makeRepo());
}

export function makeRedirectorUsecase(): UrlRedirector {
  return new UrlRedirector(makeRepo());
}
