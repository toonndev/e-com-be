import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'
import { AuthUser } from '../types/express'

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headerToken = req.headers.authorization
    if (!headerToken) {
      return res.status(401).json({ message: 'No Token, Authorization' })
    }
    const token = headerToken.split(' ')[1]
    const decode = jwt.verify(token, process.env.SECRET as string) as AuthUser
    req.user = decode

    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email
      }
    })
    if (!user || !user.enabled) {
      return res.status(400).json({ message: 'This account cannot access' })
    }

    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Token Invalid' })
  }
}

export const adminCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.user as AuthUser
    const adminUser = await prisma.user.findFirst({
      where: { email: email }
    })
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Acess Denied: Admin Only' })
    }
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error Admin access denied' })
  }
}
