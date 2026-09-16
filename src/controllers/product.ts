import { Request, Response } from 'express'
import prisma from '../config/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface ProductImageInput {
  asset_id: string
  public_id: string
  url: string
  secure_url: string
}

export const create = async (req: Request, res: Response) => {
  try {
    const { title, description, price, quantity, categoryId, images } = req.body
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item: ProductImageInput) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url
          }))
        }
      }
    })
    res.send(product)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const list = async (req: Request, res: Response) => {
  try {
    const { count } = req.params
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const read = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id)
      },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { title, description, price, quantity, categoryId, images } = req.body

    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id)
      }
    })

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item: ProductImageInput) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url
          }))
        }
      }
    })
    res.send(product)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true }
    })
    if (!product) {
      return res.status(400).json({ message: 'Product not found!!' })
    }

    const deletedImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        })
    )
    await Promise.all(deletedImage)

    await prisma.product.delete({
      where: {
        id: Number(id)
      }
    })

    res.send('Deleted Success')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const listby = async (req: Request, res: Response) => {
  try {
    const { sort, order, limit } = req.body
    console.log(sort, order, limit)
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const handleQuery = async (req: Request, res: Response, query: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query
        }
      },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Search Error' })
  }
}

const handlePrice = async (req: Request, res: Response, priceRange: number[]) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1]
        }
      },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error ' })
  }
}

const handleCategory = async (req: Request, res: Response, categoryId: (number | string)[]) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id))
        }
      },
      include: {
        category: true,
        images: true
      }
    })
    res.send(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error ' })
  }
}

export const searchFilters = async (req: Request, res: Response) => {
  try {
    const { query, category, price } = req.body

    if (query) {
      console.log('query-->', query)
      await handleQuery(req, res, query)
    }
    if (category) {
      console.log('category-->', category)
      await handleCategory(req, res, category)
    }
    if (price) {
      console.log('price-->', price)
      await handlePrice(req, res, price)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createImages = async (req: Request, res: Response) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Roitai-${Date.now()}`,
      resource_type: 'auto',
      folder: 'Ecom2024'
    })
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const removeImage = async (req: Request, res: Response) => {
  try {
    const { public_id } = req.body
    cloudinary.uploader.destroy(public_id, () => {
      res.send('Remove Image Success!!!')
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}
