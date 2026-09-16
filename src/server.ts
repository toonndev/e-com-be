import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'

import authRouter from './routes/auth'
import categoryRouter from './routes/category'
import productRouter from './routes/product'
import userRouter from './routes/user'
import adminRouter from './routes/admin'
import stripeRouter from './routes/stripe'

const app = express()

app.use(morgan('dev'))
app.use(express.json({ limit: '20mb' }))
app.use(cors())

app.use('/api', authRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', userRouter)
app.use('/api', adminRouter)
app.use('/api', stripeRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
