import { UserRepository } from '../repository/repositoryUser'

export class UserService {
  repository: UserRepository
  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async userByEmail(email: string) {
    return await this.repository.findUserByEmail(email)
  }

  async create(
    name: string,
    email: string,
    password: string,
    jewelsAmount: number,
    photo: string
  ) {
    return await this.repository.save(
      name,
      email,
      password,
      jewelsAmount,
      photo
    )
  }

  async userById(id: string) {
    return await this.repository.findUserById(id)
  }

  async userUpdated(user: object) {
    return await this.repository.userUpdated(user)
  }

  async userUpdatedJewels(id: string, jewelsAmount: number) {
    return await this.repository.userUpdatedJewels(id, jewelsAmount)
  }

  async userIdAndUpdate(id: string, user: object) {
    return await this.repository.IdAndUpdate(id, user)
  }
}
