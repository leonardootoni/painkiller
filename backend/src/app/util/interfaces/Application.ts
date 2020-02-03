/**
 * Default Application Interfaces to implement on Controllers and Validators as well to wrap all
 * REST APIs responses.
 * @author Leonardo Otoni
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Default response protocol to be adoped for all APIs during the Response in cases where an API
 * needs to send any data.
 * It aims to standardize the way that the Backend answer requests.
 */

export interface AppResponse {
  data: object;
  messages: string[];
  errors: string[];
}

/**
 * Validation interface for API Validator Classes
 */
export interface ApiValidation {
  index(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  read(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  store(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  update(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

/**
 * Behavior interface for API Controller Classes
 */
export interface ApiControl {
  index(req: Request, res: Response): Promise<Response>;
  read(req: Request, res: Response): Promise<Response>;
  store(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}
