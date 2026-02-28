import { Request, Response } from 'express';
import { UrlRedirector } from '../../usecases/url-redirector.usecase';

export class UrlRedirectorController {
  constructor(private readonly usecase: UrlRedirector) { }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.params.hash as string;
      const longUrl = await this.usecase.perform(hash);
      res.redirect(301, longUrl);
    } catch (error: any) {
      if (error.message === "Invalid hash.") {
        res.status(404).send("Invalid hash.");
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
