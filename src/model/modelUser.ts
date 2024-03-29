import { mongoose } from '../config/connection'
import { IUser } from '../entities/entitiesUser'

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  jewelsAmount: {
    type: Number,
    default: 0,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'products',
    },
  ],
  photo: {
    type: String,
    default: '_photo_',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
})

export const User = mongoose.model<IUser>('users', UserSchema)
