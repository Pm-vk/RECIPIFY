const {
  GoogleGenerativeAI,
  GoogleAIFileManager
} = require('@google/generative-ai')
require('dotenv').config({ path: '.env' })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('No GEMINI_API_KEY found in .env')
  process.exit(1)
}

// NOTE: The `listModels` capability isn't directly on the main class in all versions.
// We'll try to use a straight fetch to the API endpoint to be sure, bypassing SDK quirks if any.
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY

async function listModelsRaw () {
  try {
    console.log('Fetching models from API...')
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    if (!response.ok) {
      console.error(
        'Failed to list models:',
        response.status,
        await response.text()
      )
      return
    }
    const data = await response.json()
    if (data.models) {
      console.log('\nAvailable Models:')
      data.models.forEach(m => {
        const supportedMethods = m.supportedGenerationMethods || []
        if (supportedMethods.includes('generateContent')) {
          console.log(`- ${m.name} (Display: ${m.displayName})`)
        }
      })
    } else {
      console.log('No models found in response.')
    }
  } catch (error) {
    console.error('Error fetching models:', error)
  }
}

listModelsRaw()
