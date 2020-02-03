import { Request, Response, NextFunction } from 'express';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_RECORDS = 10;
const MAX_PAGE_RECORDS = 20;

/**
 * Default Pagination Middleware
 * @author Leonardo Otoni
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const reqPage = Number.parseInt(req.query.page, 10);
  const reqLimit = Number.parseInt(req.query.limit, 10);

  const serverPage = reqPage || DEFAULT_PAGE;
  const serverLimit = reqLimit && reqLimit === MAX_PAGE_RECORDS ? reqLimit : DEFAULT_PAGE_RECORDS;

  const { query } = req;
  delete query.page;
  delete query.limit;

  query.offset = (serverPage - 1) * serverLimit;
  query.limit = serverLimit;
  req.query = query;
  return next();
};
