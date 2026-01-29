const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config({ path: '.env' })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('No GEMINI_API_KEY found in .env')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

async function listModels () {
  try {
    // The SDK might not expose listModels directly on genAI instance in all versions,
    // but usually it's manager-level. However, looking at docs, it's often via the ModelService.
    // But for the node sdk specifically, it's not always straightforward.
    // Let's try a simple generation check with 'gemini-pro' and 'gemini-1.5-flash' to see what happens,
    // actually, let's just use the `gemini-pro` as a fallback.

    // Attempting to list models if method exists (it does in newer versions)
    // Otherwise we'll just log "sdk version might be old"

    console.log('Checking available models...')
    // Note: listModels is not always available in the high-level client object in some versions.
    // But let's try to verify if gemini-pro works.

    const modelsToCheck = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ]

    for (const modelName of modelsToCheck) {
      process.stdout.write(`Testing ${modelName}... `)
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Hello')
        const response = await result.response
        console.log('✅ OK')
      } catch (e) {
        console.log(`❌ Failed: ${e.message.split('\n')[0]}`)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

listModels()
