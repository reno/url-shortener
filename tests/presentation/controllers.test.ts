import { Request, Response } from 'express';
import { UrlShortenerController } from '../../src/presentation/controllers/url-shortener.controller';
import { UrlRedirectorController } from '../../src/presentation/controllers/url-redirector.controller';

import { UrlShortener } from '../../src/usecases/url-shortener.usecase';
import { UrlRedirector } from '../../src/usecases/url-redirector.usecase';

describe('Controllers Layer', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let redirectMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock, send: sendMock });
    redirectMock = jest.fn();

    mockRequest = {};
    mockResponse = {
      status: statusMock as any,
      redirect: redirectMock as any,
    };
  });

  describe('UrlShortenerController', () => {
    it('should return 400 if longUrl is missing', async () => {
      const mockUseCase = { perform: jest.fn() } as unknown as UrlShortener;
      const controller = new UrlShortenerController(mockUseCase);

      mockRequest.body = {};
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Missing longUrl" });
    });

    it('should return 400 if longUrl is invalid', async () => {
      const mockUseCase = { perform: jest.fn() } as unknown as UrlShortener;
      const controller = new UrlShortenerController(mockUseCase);

      mockRequest.body = { longUrl: 'not-a-valid-url' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid longUrl format. Must be a valid HTTP/HTTPS URL." });
    });

    it('should return 200 and hash if longUrl is valid', async () => {
      const mockUseCase = { perform: jest.fn().mockResolvedValue('aB3') } as unknown as UrlShortener;
      const controller = new UrlShortenerController(mockUseCase);

      mockRequest.body = { longUrl: 'https://example.com' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.perform).toHaveBeenCalledWith('https://example.com');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ hash: 'aB3' });
    });

    it('should return 500 if use case throws an error', async () => {
      const mockUseCase = { perform: jest.fn().mockRejectedValue(new Error('Internal error')) } as unknown as UrlShortener;
      const controller = new UrlShortenerController(mockUseCase);

      mockRequest.body = { longUrl: 'https://example.com' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal error' });
    });
  });

  describe('UrlRedirectorController', () => {
    it('should redirect 301 if hash is valid', async () => {
      const mockUseCase = { perform: jest.fn().mockResolvedValue('https://example.com') } as unknown as UrlRedirector;
      const controller = new UrlRedirectorController(mockUseCase);

      mockRequest.params = { hash: 'aB3' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.perform).toHaveBeenCalledWith('aB3');
      expect(redirectMock).toHaveBeenCalledWith(301, 'https://example.com');
    });

    it('should return 404 if hash is invalid', async () => {
      const mockUseCase = { perform: jest.fn().mockRejectedValue(new Error('Invalid hash.')) } as unknown as UrlRedirector;
      const controller = new UrlRedirectorController(mockUseCase);

      mockRequest.params = { hash: 'invalid_hash' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith('Invalid hash.');
    });

    it('should return 500 if an unknown error occurs', async () => {
      const mockUseCase = { perform: jest.fn().mockRejectedValue(new Error('Unexpected system crash')) } as unknown as UrlRedirector;
      const controller = new UrlRedirectorController(mockUseCase);

      mockRequest.params = { hash: 'aB3' };
      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Unexpected system crash' });
    });
  });
});
