import { ValidationError } from 'yup'
import { NextFunction, Request, Response } from 'express'

export default (schema: any) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log(
      `Validando a rota: ${req.method} | ${req.path} | `,
      new Date()
    )

    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        { strict: true, abortEarly: false }
      )
      next()
    } catch (error) {
      const { name, message, errors } = error as ValidationError
      res.status(422).send({ name, message, errors })
    }
  }
