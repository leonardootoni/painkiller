import { Request, Response } from 'express';
import GroupModel from '../../models/security/GroupModel';
import { GroupQueryData, GroupData } from '../../util/interfaces/Group';

/**
 * Controller class to Handle Groups operations.
 * @author Leonardo Otoni
 */
class GroupController {
  /**
   * Fetch All groups according to query criteria:
   *  name - Group name
   *  blocked - Group status
   * @param req
   * @param res
   */
  public async index(req: Request, res: Response): Promise<Response> {
    const result = await GroupModel.listGroups({ ...(req.query as GroupQueryData) });
    const data = { groups: result[0], count: result[1] };
    return res.json({ data });
  }

  /**
   * Fetch Group information by id as well as Users and Resouces associations
   * @param req
   * @param res
   */
  public async read(req: Request, res: Response): Promise<Response> {
    const groupId = parseInt(req.params.id, 10);
    const group = await GroupModel.fetchGroupById(groupId);
    return res.json({ data: group });
  }

  /**
   * Stores a new group as well as their associations with users and resources, if exists.
   * @param req
   * @param res
   */
  public async store(req: Request, res: Response): Promise<Response> {
    const group = req.body as GroupData;
    const [groupExists, message] = await GroupModel.groupNameExists(group.name || '');
    if (groupExists) {
      return res.status(400).json({ errors: [message] });
    }

    const newGroup = await GroupModel.createGroup(group);
    const { id } = newGroup;
    return res.json({ data: { group: { id } } });
  }

  /**
   * Update an existing group and its respespective relations (users and resources + permissions) if
   * exists.
   * @param req
   * @param res
   */
  public async update(req: Request, res: Response): Promise<Response> {
    const groupData = { ...req.body } as GroupData;
    groupData.id = parseInt(req.params.id, 10);
    await GroupModel.updateGroup(groupData);
    return res.json();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const groupId = parseInt(req.params.id, 10);
    await GroupModel.deleteGroupById(groupId);
    return res.json();
  }
}

export default new GroupController();
