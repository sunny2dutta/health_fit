import dotenv from 'dotenv'
dotenv.config()

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

async function insertUserViaAPI() {
  try {
    // Insert user data via API
    const emailResponse = await fetch(`${API_BASE_URL}/api/save-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'sunny.kolkata@example.com'
      })
    })

    const emailResult = await emailResponse.json()
    
    if (!emailResponse.ok) {
      throw new Error(emailResult.error || 'Failed to save email')
    }

    console.log('✅ Email saved via API:', emailResult)

    // Insert assessment data via API
    const assessmentResponse = await fetch(`${API_BASE_URL}/api/save-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sunny.kolkata@example.com',
        personalInfo: {
          name: 'Sunny',
          dateOfBirth: '1990-01-01',
          phone: '+91-9876543210',
          healthConcerns: ['General wellness'],
          servicePreferences: ['Online consultation']
        },
        score: 80,
        answers: [
          { question: 'Test question', selectedAnswer: 'Test answer', score: 8 }
        ]
      })
    })

    const assessmentResult = await assessmentResponse.json()
    
    if (!assessmentResponse.ok) {
      throw new Error(assessmentResult.error || 'Failed to save assessment')
    }

    console.log('✅ Assessment data inserted via API:', assessmentResult)

  } catch (error) {
    console.error('❌ Error using API:', error.message)
  }
}

insertUserViaAPI()

