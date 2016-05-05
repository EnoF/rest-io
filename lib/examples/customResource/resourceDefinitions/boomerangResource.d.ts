import { Resource } from '../../../src/resource';
import { Request, Response } from 'express';
export default class BoomerangResource extends Resource {
    setupRoutes(): void;
    getAll(req: Request, res: Response): void;
    getById(req: Request, res: Response): void;
    create(req: Request, res: Response): void;
    addAndRetrieve(req: Request, res: Response): void;
}
