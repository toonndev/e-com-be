import { Request, Response } from 'express'
import prisma from '../config/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required!!!' })
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required!!!' })
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if (user) {
      return res.status(400).json({ message: 'Email already exits!!' })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword
      }
    })

    res.send('Register Success')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if (!user || !user.enabled) {
      return res.status(400).json({ message: 'User Not found or not Enabled' })
    }

    const isMatch = await bcrypt.compare(password, user.password as string)
    if (!isMatch) {
      return res.status(400).json({ message: 'Password Invalid!!!' })
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    jwt.sign(payload, process.env.SECRET as string, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: 'Server Error' })
      }
      res.json({ payload, token })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const currentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user!.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    res.json({ user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}
