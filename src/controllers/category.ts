import { Request, Response } from 'express'
import prisma from '../config/prisma'

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const category = await prisma.category.create({
      data: {
        name: name
      }
    })
    res.send(category)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const list = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findMany()
    res.send(category)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await prisma.category.delete({
      where: {
        id: Number(id)
      }
    })
    res.send(category)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}
