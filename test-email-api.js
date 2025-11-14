const API_BASE_URL = 'http://localhost:3000'

// Test email API endpoint with various scenarios
async function testEmailAPI() {
    console.log('📧 Testing Email API Endpoint (/api/save-email)...\n')

    const testCases = [
        {
            name: 'Valid email',
            email: 'valid.user@example.com',
            expected: 'success'
        },
        {
            name: 'Another valid email',
            email: 'test.user123@gmail.com',
            expected: 'success'
        },
        {
            name: 'Duplicate email (should handle gracefully)',
            email: 'valid.user@example.com',
            expected: 'success'
        },
        {
            name: 'Invalid email format 1',
            email: 'invalid-email',
            expected: 'error'
        },
        {
            name: 'Invalid email format 2',
            email: 'test@',
            expected: 'error'
        },
        {
            name: 'Empty email',
            email: '',
            expected: 'error'
        }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        console.log(`${i + 1}️⃣ Testing: ${testCase.name}`)
        console.log(`   Email: "${testCase.email}"`)

        try {
            const response = await fetch(`${API_BASE_URL}/api/save-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testCase.email })
            })

            const result = await response.json()

            if (testCase.expected === 'success' && response.ok) {
                console.log(`   ✅ PASS - Success: ${result.message}`)
                if (result.user_id) console.log(`   📝 User ID: ${result.user_id}`)
                if (result.isNew !== undefined) console.log(`   🆕 New user: ${result.isNew}`)
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

    console.log('📧 Email API testing completed!\n')
}

// Run the test
testEmailAPI()