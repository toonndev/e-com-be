import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
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

app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.get('/api-docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>E-Com API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui'
        })
      }
    </script>
  </body>
</html>`)
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
