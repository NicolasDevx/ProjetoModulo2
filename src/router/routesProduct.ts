import { Router } from 'express'
import { RepositoryProduct } from '../repository/repositoryProduct'
import { ProductService } from '../service/serviceProduct'
import validateRouter from '../middleware/validateRouter'
import * as productSchema from '../schema/schemaProduct'
import { auth } from '../middleware/auth'
import { isAdmin } from '../middleware/verifyPermission'

const router = Router()

const repository = new RepositoryProduct()
const service = new ProductService(repository)

router.post(
  '/',
  validateRouter(productSchema.CreatePerson.schema),
  auth,
  isAdmin,
  async (req, res) => {
    const { name, value, amount, description, photo } = req.body

    const newProduct = await service.create(
      name,
      value,
      amount,
      description,
      photo
    )
    if (!newProduct)
      return res.status(404).send({ error: 'Product creation failed.' })

    res.status(201).send({ newProduct })
  }
)

router.put(
  '/:id',
  validateRouter(productSchema.CreatePerson.schema),
  auth,
  isAdmin,
  async (req, res) => {
    const { name, value, amount, description, photo } = req.body
    const { id } = req.params

    const productUpdate = await service.update(
      id,
      name,
      value,
      amount,
      description,
      photo
    )
    if (!productUpdate)
      return res.status(404).send({ error: 'Product not found.' })

    const existProduct = await service.userById(id)
    if (!existProduct)
      return res.status(404).send({ error: 'Product not found.' })

    existProduct.updateAt = new Date()

    const productUpdated = await service.productUpdated(existProduct)

    res.status(200).send({ product: productUpdated })
  }
)

router.get('/', auth, async (req, res) => {
  const amount = 0

  const products = await service.find()
  if (!products)
    return res.status(404).send({ error: 'Products not found.' })

  const productsFilter = products.filter(
    (products: { amount: number }) =>
      products.amount > 0 && (amount === undefined || products.amount >= amount)
  )

  res.status(200).send({ productsFilter })
})

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params

  const product = await service.findId(id)
  if (!product)
    return res.status(404).send({ error: 'Products not found.' })

  res.status(200).send({ product })
})

export default router
