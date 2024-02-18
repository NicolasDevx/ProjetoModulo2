import { Admin } from '../model/modelAdmin'

export class AdminRepository{
  async findAdminByEmail(email: string) {
    return await Admin.findOne({ email }).exec()
  }

  async findAdminById(id: string) {
    return await Admin.findById(id).exec()
  }
}
