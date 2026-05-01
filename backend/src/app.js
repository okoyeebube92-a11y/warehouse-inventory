import express from 'express'
import cors from 'cors'
import entryRoutes from './routes/entryRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/__health', (req, res) => {
  console.log('HEALTH HIT')
  res.json({ status: 'alive' })
})

app.use('/api/entries', entryRoutes)

export default app