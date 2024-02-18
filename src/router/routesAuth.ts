import { Router } from 'express'
import { UserRepository } from '../repository/repositoryUser'
import { UserService } from '../service/serviceUser'
import { AdminRepository } from '../repository/repositoryAdmin'
import { AdminService } from '../service/serviceAdmin'
import validateRouter from '../middleware/validateRouter'
import * as authSchema from '../schema/schemaAuth'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)

router.post(
  '/',
  validateRouter(authSchema.CreatePerson.schema),
  async (req, res) => {
    const { email, password } = req.body

    let user
    let admin
    let isAdmin = false

    user = await userService.userByEmail(email)
    if (user) {
      const userPasswordCompare = await compare(password, user.password)
      if (userPasswordCompare) {
        user.password = ''
        isAdmin = false
      } else {
        user = null
      }
    }

    if (user === null) {
      admin = await adminService.adminByEmail(email)
      if (admin) {
        const adminPasswordCompare = await compare(password, admin.password)
        if (adminPasswordCompare) isAdmin = true
        else
          return res.status(401).send({
            message:
              'Check your email and password and try again.',
          })
      } else
        return res.status(401).send({
          message:
            'Check your email and password and try again.',
        })
    }

    const id = isAdmin ? admin?._id.toString() : user?._id.toString()

    const token = jwt.sign({ sub: id }, process.env.SECRETY_KEY as string, {
      expiresIn: 24 * 60 * 60,
    })

    res.status(200).send({
      message: isAdmin
        ? 'Admin authentication successful.'
        : 'User authentication successful.',
      userOrAdmin: isAdmin ? { admin } : { user },
      token,
    })
  }
)

export default router
