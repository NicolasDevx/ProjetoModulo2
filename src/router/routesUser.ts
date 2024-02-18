import { Router } from 'express'
import { UserService } from '../service/serviceUser'
import { UserRepository } from '../repository/repositoryUser'
import { AdminRepository } from '../repository/repositoryAdmin'
import { AdminService } from '../service/serviceAdmin'
import { ProductService } from '../service/serviceProduct'
import { RepositoryProduct } from '../repository/repositoryProduct'
import validateRouter from '../middleware/validateRouter'
import { auth } from '../middleware/auth'
import { isAdmin } from '../middleware/verifyPermission'
import { hash } from 'bcrypt'
import * as userSchema from '../schema/schemaUser'
import * as jewelsAmountSchema from '../schema/schemaAmount'

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)

const productRepository = new RepositoryProduct()
const productService = new ProductService(productRepository)

router.post(
  '/',
  validateRouter(userSchema.CreatePerson.schema),
  async (req, res) => {
    const { name, email, password, jewelsAmount, photo } = req.body

    const existUser = await userService.userByEmail(email)
    if (existUser)
      return res.status(409).send({
        message:
          'E-mail already registered',
      })

    const passwordHashed = await hash(password, 8)

    const newUser = await userService.create(
      name,
      email,
      passwordHashed,
      jewelsAmount,
      photo
    )

    res.status(201).send({ user: newUser })
  }
)

router.post('/productExchange', auth, async (req, res) => {
  const { idUser, idProduct } = req.body

  const user: any = await userService.userById(idUser)
  const product: any = await productService.findId(idProduct)

  if (!user || !product)
    return res.status(404).send({ erros: 'User or Products not found.' })

  if (user.jewelsAmount < product.value) {
    res
      .status(404)
      .send({ error: 'Insufficient balance' })
  } else {
    user.jewelsAmount -= product.value
    user.products.push(product)

    await userService.userIdAndUpdate(idUser, user)

    if (product.amount > 0) {
      product.amount--
    } else {
      res
        .status(400)
        .send({ error: 'Product out of stock' })
    }

    await productService.productIdAndUpdate(idProduct, product)
  }

  res.status(200).send({ message: 'Product recalled' })
})

router.patch(
  '/:id',
  validateRouter(jewelsAmountSchema.CreatePerson.schema),
  auth,
  isAdmin,
  async (req, res) => {
    const { id } = req.params
    const { jewelsAmount } = req.body

    const jewelsToUpdated = await userService.userUpdatedJewels(
      id,
      jewelsAmount
    )
    if (!jewelsToUpdated)
      return res.status(404).send({ error: 'User not found.' })

    const existUser = await userService.userById(id)
    if (!existUser)
      return res.status(404).send({ error: 'User not found.' })

    existUser.updateAt = new Date()

    const userUpdatedJewels = await userService.userUpdated(existUser)

    res.status(200).send({ userUpdate: userUpdatedJewels })
  }
)

router.get('/', auth, async (req, res) => {
  const id = req.body.userId.sub

  const userId = await userService.userById(id)
  if (id === userId?._id.toString()) {
    userId!.password = ''
    res.status(201).send({ user: userId })
    return
  }

  const adminId = await adminService.adminById(id)
  if (id === adminId?._id.toString()) {
    adminId!.password = ''
    res.status(201).send({ admin: adminId })
    return
  }

  res.status(404).send({ message: 'Error: User not found.' })
})

export default router
