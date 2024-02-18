import { Product } from '../model/modelProduct'

export interface IUser {
  name: string
  email: string
  password: string
  jewelsAmount: number
  products: typeof Product
  photo: string
  createdAt: Date
  updateAt: Date
  _id: string
  __v: number
}
