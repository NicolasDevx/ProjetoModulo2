import { Request, Response, NextFunction } from 'express'
import { AdminRepository } from '../repository/repositoryAdmin'
import { AdminService } from '../service/serviceAdmin'

const repository = new AdminRepository()
const service = new AdminService(repository)

export const isAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id = request.body.userId.sub

  const userIdExist = await service.adminById(id)
  if (id === userIdExist?.id) next()
  else
    return response
      .status(403)
      .send({
        message:
          'Without permission',
      })
}
