import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

export interface ResourceQueryData {
  name?: string;
  department?: string;
  limit: number;
  offset: number;
}

const indexSchema: Yup.ObjectSchema<ResourceQueryData> = Yup.object().shape<ResourceQueryData>({
  name: Yup.string().min(3),
  department: Yup.string().min(3),
  limit: Yup.number()
    .required()
    .max(20),
  offset: Yup.number().required(),
});

class ResourceValidator {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const query = req.query as ResourceQueryData;

    try {
      await indexSchema.validate(query, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }
}

export default new ResourceValidator();
