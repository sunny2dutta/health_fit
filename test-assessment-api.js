const API_BASE_URL = 'http://localhost:3000'

// Test assessment API endpoint with various scenarios
async function testAssessmentAPI() {
    console.log('📊 Testing Assessment API Endpoint (/api/save-assessment)...\n')

    const testCases = [
        {
            name: 'Complete valid assessment',
            data: {
                email: 'complete.user@example.com',
                personalInfo: {
                    name: 'John Doe',
                    dateOfBirth: '1985-05-15',
                    phone: '+91-9876543210',
                    healthConcerns: ['Weight management', 'Stress reduction'],
                    servicePreferences: ['Online consultation', 'Nutrition planning']
                },
                score: 85,
                answers: [
                    { question: 'How often do you exercise?', selectedAnswer: '3-4 times per week', score: 8 },
                    { question: 'How would you rate your stress levels?', selectedAnswer: 'Moderate', score: 6 }
                ]
            },
            expected: 'success'
        },
        {
            name: 'Minimal valid assessment (existing user)',
            data: {
                email: 'complete.user@example.com',
                score: 70,
                answers: [
                    { question: 'Follow-up question', selectedAnswer: 'Good', score: 7 }
                ]
            },
            expected: 'success'
        },
        {
            name: 'New user with full data',
            data: {
                email: 'newuser@example.com',
                personalInfo: {
                    name: 'Jane Smith',
                    dateOfBirth: '1990-12-25',
                    phone: '+91-8765432109',
                    healthConcerns: ['Fitness improvement'],
                    servicePreferences: ['Health tracking']
                },
                score: 92,
                answers: [
                    { question: 'Energy levels?', selectedAnswer: 'Excellent', score: 10 }
                ]
            },
            expected: 'success'
        },
        {
            name: 'Missing required email',
            data: {
                score: 75,
                answers: [{ question: 'Test', selectedAnswer: 'Test', score: 7 }]
            },
            expected: 'error'
        },
        {
            name: 'Missing required score',
            data: {
                email: 'test@example.com',
                answers: [{ question: 'Test', selectedAnswer: 'Test', score: 7 }]
            },
            expected: 'error'
        },
        {
            name: 'Missing required answers',
            data: {
                email: 'test@example.com',
                score: 80
            },
            expected: 'error'
        },
        {
            name: 'Invalid email format',
            data: {
                email: 'invalid-email-format',
                score: 75,
                answers: [{ question: 'Test', selectedAnswer: 'Test', score: 7 }]
            },
            expected: 'success' // Server doesn't validate email format in assessment endpoint
        }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        console.log(`${i + 1}️⃣ Testing: ${testCase.name}`)

        try {
            const response = await fetch(`${API_BASE_URL}/api/save-assessment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testCase.data)
            })

            const result = await response.json()

            if (testCase.expected === 'success' && response.ok) {
                console.log(`   ✅ PASS - Assessment saved successfully`)
                console.log(`   📝 Assessment ID: ${result.assessment_id}`)
                console.log(`   👤 User ID: ${result.user_id}`)
                if (result.message) console.log(`   💬 Message: ${result.message}`)
            } else if (testCase.expected === 'error' && !response.ok) {
                console.log(`   ✅ PASS - Expected error: ${result.error}`)
            } else {
                console.log(`   ❌ UNEXPECTED RESULT:`)
                console.log(`      Status: ${response.status}`)
                console.log(`      Response: ${JSON.stringify(result, null, 2)}`)
            }

        } catch (error) {
            if (testCase.expected === 'error') {
                console.log(`   ✅ PASS - Network/Parse error as expected: ${error.message}`)
            } else {
                console.log(`   ❌ UNEXPECTED ERROR: ${error.message}`)
            }
        }

        console.log('') // Empty line for readability
    }

    console.log('📊 Assessment API testing completed!\n')
}

// Run the test
testAssessmentAPI()