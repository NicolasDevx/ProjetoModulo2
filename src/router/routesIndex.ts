import { Router } from 'express'
import userRouter from './routesUser'
import authRouter from './routesAuth'
import productRouter from './routesProduct'

const routes = Router()

routes.use('/users', userRouter)
routes.use('/auth', authRouter)
routes.use('/products', productRouter)

export default routes
