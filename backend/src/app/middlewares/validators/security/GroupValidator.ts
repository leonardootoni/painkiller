import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';
import {
  GroupQueryData,
  GroupData,
  GroupUserData,
  GroupResourceData,
  GroupResourcePermissionsData,
  GroupResourceOperation,
} from '../../../util/interfaces/Group';
import GroupModel from '../../../models/security/GroupModel';

const indexSchema: Yup.ObjectSchema<GroupQueryData> = Yup.object().shape<GroupQueryData>({
  id: Yup.number(),
  name: Yup.string().min(3),
  blocked: Yup.boolean(),
  limit: Yup.number().required(),
  offset: Yup.number().required(),
});

const storeSchema: Yup.ObjectSchema<GroupData> = Yup.object().shape<GroupData>({
  name: Yup.string()
    .required()
    .min(3)
    .max(50),
  blocked: Yup.boolean(),
  description: Yup.string().max(255),
  users: Yup.array().of(
    Yup.object().shape<GroupUserData>({
      id: Yup.number().required(),
    })
  ),
  resources: Yup.array().of(
    Yup.object().shape<GroupResourceData>({
      id: Yup.number().required(),
      permissions: Yup.object()
        .shape<GroupResourcePermissionsData>({
          write: Yup.boolean().required(),
          update: Yup.boolean().required(),
          del: Yup.boolean().required(),
        })
        .required(),
    })
  ),
});

const updateSchema: Yup.ObjectSchema<GroupData> = Yup.object().shape<GroupData>({
  id: Yup.number().required(),
  name: Yup.string()
    .required()
    .max(50),
  blocked: Yup.boolean(),
  description: Yup.string().max(255),
  users: Yup.array().of(
    Yup.object().shape<GroupUserData>({
      id: Yup.number().required(),
      operation: Yup.string()
        .required()
        .oneOf([
          GroupResourceOperation.Create,
          GroupResourceOperation.Update,
          GroupResourceOperation.Delete,
        ]),
    })
  ),
  resources: Yup.array().of(
    Yup.object().shape<GroupResourceData>({
      id: Yup.number().required(),
      permissions: Yup.object()
        .shape<GroupResourcePermissionsData>({
          write: Yup.boolean(),
          update: Yup.boolean(),
          del: Yup.boolean(),
        })
        .when('operation', {
          is: operation =>
            operation === GroupResourceOperation.Create ||
            operation === GroupResourceOperation.Update,
          then: Yup.object()
            .shape<GroupResourcePermissionsData>({
              write: Yup.boolean().required(),
              update: Yup.boolean().required(),
              del: Yup.boolean().required(),
            })
            .required(),
        }),
      operation: Yup.string()
        .required()
        .oneOf([
          GroupResourceOperation.Create,
          GroupResourceOperation.Update,
          GroupResourceOperation.Delete,
        ]), // Resources associations: create, update or delete.
    })
  ),
});

const readSchema: Yup.ObjectSchema = Yup.object().shape({
  id: Yup.number().required(),
});

const deleteSchema: Yup.ObjectSchema = Yup.object().shape({
  id: Yup.number().required(),
});

/**
 * Group API Validators
 *
 * @method index  - Validate Get Requests to list paginated data
 * @method read   - Validate Get Requests to fetch an entity or associated data
 * @method store  - Validate Post Requests to create new data
 * @method update - Validate Pust Requests to update an existing data
 * @method delete - Validate Delete Requests to delete an existing data
 *
 * @author Leonardo Otoni
 */
class GroupValidator {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await indexSchema.validate({ ...req.query } as GroupQueryData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }

  public async read(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await readSchema.validate({ ...req.params }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }

  public async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await storeSchema.validate({ ...req.body } as GroupData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const groupData = { ...req.body } as GroupData;
    groupData.id = parseInt(req.params.id, 10);
    try {
      await updateSchema.validate(groupData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    // Additional database validations before to process an update operation
    const [isValid, errorMessage] = await GroupModel.validateUpdateOperation(groupData);
    if (!isValid) {
      return res.status(400).json({ errors: [errorMessage] });
    }

    return next();
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await deleteSchema.validate({ ...req.params }, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }
}

export default new GroupValidator();
