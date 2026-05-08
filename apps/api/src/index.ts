import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorMiddleware } from './middleware/error.middleware'
import authRouter from './routes/auth.routes'
import coursesRouter from './routes/courses.routes'
import catalogRouter from './routes/catalog.routes'
import promptsRouter from './routes/prompts.routes'
import ideasRouter from './routes/ideas.routes'
import governanceRouter from './routes/governance.routes'
import tutorRouter from './routes/tutor.routes'
import analyticsRouter from './routes/analytics.routes'
import adminRouter from './routes/admin.routes'
import authorRouter from './routes/author.routes'
import ordersRouter from './routes/orders.routes'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(helmet())
app.use(cors({
  origin: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('combined'))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRouter)
app.use('/courses', coursesRouter)
app.use('/catalog', catalogRouter)
app.use('/prompts', promptsRouter)
app.use('/ideas', ideasRouter)
app.use('/governance', governanceRouter)
app.use('/tutor', tutorRouter)
app.use('/analytics', analyticsRouter)
app.use('/admin', adminRouter)
app.use('/author', authorRouter)
app.use('/orders', ordersRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})

export default app
