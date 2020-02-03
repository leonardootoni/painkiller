import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

import Resource from '../../entity/Resource';
import { ResourceQueryData } from '../../middlewares/validators/security/ResourceValidator';

/**
 * Controller Class that provides a list of all Application URL's.
 * All Resources are static, not changed by the app and are loaded during the migration process.
 * @author: Leonardo Otoni
 */
class ResourceController {
  /**
   * List all Application Resources available to be used in Groups. This list ignores the main url
   * '/resource' as a way to avoid users to remove access to this route.
   * @param req
   * @param res
   */
  public async index(req: Request, res: Response): Promise<Response> {
    const reqParams = req.query as ResourceQueryData;

    // Generic query to fetch data
    const queryFilter = ['name <> :resourceName'];
    const queryParams: { [k: string]: string | number | boolean } = { resourceName: '/resources' };
    if (reqParams.name) {
      queryFilter.push('and LOWER(name) like :name');
      queryParams.name = `${reqParams.name.toLowerCase()}%`;
    }

    if (reqParams.department) {
      queryFilter.push('and LOWER(department) like :department');
      queryParams.department = `${reqParams.department.toLowerCase()}%`;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .select(['r.id', 'r.name', 'r.department'])
      .from(Resource, 'r')
      .where(queryFilter.join(' '), { ...queryParams })
      .getManyAndCount();
    return res.json({ data: { resources: result[0], count: result[1] } });
  }
}

export default new ResourceController();
