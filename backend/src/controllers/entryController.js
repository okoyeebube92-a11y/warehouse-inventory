import { createEntries } from '../services/entryService.js'

export const addEntries = async (req, res) => {
  try {
    const entries = req.body

    if (!Array.isArray(entries)) {
      return res.status(400).json({
        success: false,
        message: 'Entries must be an array'
      })
    }

    const savedEntries = await createEntries(entries)

    res.status(201).json({
      success: true,
      data: savedEntries
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

console.log("HIT ENTRY CONTROLLER");
console.log('ENTRY BODY:', req.body)