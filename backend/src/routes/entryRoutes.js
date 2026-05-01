import express from 'express'
import { addEntries } from '../controllers/entryController.js'

const router = express.Router()

router.get('/ping', (req, res) => {
  console.log('ROUTER PING HIT')
  res.json({ ok: true })
})

router.post('/', addEntries)

export default router