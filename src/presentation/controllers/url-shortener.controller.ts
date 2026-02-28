import { Request, Response } from 'express';
import { UrlShortener } from '../../usecases/url-shortener.usecase';

export class UrlShortenerController {
  constructor(private readonly usecase: UrlShortener) { }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { longUrl } = req.body;
      if (!longUrl) {
        res.status(400).json({ error: "Missing longUrl" });
        return;
      }

      try {
        const parsedUrl = new URL(longUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          throw new Error("Invalid protocol");
        }
      } catch (e) {
        res.status(400).json({ error: "Invalid longUrl format. Must be a valid HTTP/HTTPS URL." });
        return;
      }

      const hash = await this.usecase.perform(longUrl);
      res.status(200).json({ hash });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
