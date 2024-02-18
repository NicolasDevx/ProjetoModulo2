import { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' })

  const tokenParts = authHeader.split(' ')

  if (tokenParts.length !== 2)
    return res.status(401).send({ error: 'Error Token' })

  const [tokenSchema, token] = tokenParts

  if (tokenSchema !== 'Bearer')
    return res.status(401).send({ error: 'Error Token' })

  const verify = jwt.verify(token, process.env.CRYPTO_KEY as string)

  req.body.userId = verify
  next()
}
