import { UrlShortenerController } from '../../presentation/controllers/url-shortener.controller';
import { UrlRedirectorController } from '../../presentation/controllers/url-redirector.controller';
import { makeShortenUsecase, makeRedirectorUsecase } from './use-cases.factory';

export function makeUrlShortenerController(): UrlShortenerController {
  return new UrlShortenerController(makeShortenUsecase());
}

export function makeUrlRedirectorController(): UrlRedirectorController {
  return new UrlRedirectorController(makeRedirectorUsecase());
}
