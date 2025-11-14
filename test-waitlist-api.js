const API_BASE_URL = 'http://localhost:3000'

// Test waitlist API endpoints
async function testWaitlistAPI() {
    console.log('📝 Testing Waitlist API Endpoints...\n')

    // First test: Get waitlist stats
    console.log('1️⃣ Testing /api/waitlist-stats (GET)')
    try {
        const statsResponse = await fetch(`${API_BASE_URL}/api/waitlist-stats`)
        const statsResult = await statsResponse.json()
        
        if (statsResponse.ok) {
            console.log('   ✅ Waitlist stats retrieved successfully')
            console.log(`   📊 Total waitlist count: ${statsResult.totalWaitlist}`)
            console.log(`   🔢 Next position: ${statsResult.nextPosition}`)
        } else {
            console.log(`   ❌ Failed to get waitlist stats: ${statsResult.error}`)
        }
    } catch (error) {
        console.log(`   ❌ Error getting waitlist stats: ${error.message}`)
    }

    console.log('\n2️⃣ Testing /api/join-waitlist (POST) - Various scenarios\n')

    const testCases = [
        {
            name: 'New user joining waitlist',
            email: 'waitlist.user1@example.com',
            expected: 'success'
        },
        {
            name: 'Another new user',
            email: 'waitlist.user2@example.com', 
            expected: 'success'
        },
        {
            name: 'Duplicate user (should show already joined)',
            email: 'waitlist.user1@example.com',
            expected: 'success'
        },
        {
            name: 'Invalid email format',
            email: 'invalid-email',
            expected: 'error'
        },
        {
            name: 'Empty email',
            email: '',
            expected: 'error'
        },
        {
            name: 'Email with spaces',
            email: ' spaced.email@example.com ',
            expected: 'error'
        }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        console.log(`   ${i + 1}️⃣ Testing: ${testCase.name}`)
        console.log(`      Email: "${testCase.email}"`)

        try {
            const response = await fetch(`${API_BASE_URL}/api/join-waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testCase.email })
            })

            const result = await response.json()

            if (testCase.expected === 'success' && response.ok) {
                console.log(`      ✅ PASS - ${result.message}`)
                console.log(`      🎯 Waitlist position: ${result.position}`)
                if (result.alreadyJoined) {
                    console.log(`      🔄 Already joined: ${result.alreadyJoined}`)
                }
                if (result.offline) {
                    console.log(`      🔌 Offline mode: ${result.offline}`)
                }
            } else if (testCase.expected === 'error' && !response.ok) {
                console.log(`      ✅ PASS - Expected error: ${result.error}`)
            } else {
                console.log(`      ❌ UNEXPECTED RESULT:`)
                console.log(`         Status: ${response.status}`)
                console.log(`         Response: ${JSON.stringify(result, null, 2)}`)
            }

        } catch (error) {
            if (testCase.expected === 'error') {
                console.log(`      ✅ PASS - Network/Parse error as expected: ${error.message}`)
            } else {
                console.log(`      ❌ UNEXPECTED ERROR: ${error.message}`)
            }
        }

        console.log('') // Empty line for readability
    }

    // Final stats check
    console.log('3️⃣ Final waitlist stats check')
    try {
        const finalStatsResponse = await fetch(`${API_BASE_URL}/api/waitlist-stats`)
        const finalStatsResult = await finalStatsResponse.json()
        
        if (finalStatsResponse.ok) {
            console.log('   ✅ Final stats retrieved')
            console.log(`   📊 Final total waitlist count: ${finalStatsResult.totalWaitlist}`)
            console.log(`   🔢 Next position would be: ${finalStatsResult.nextPosition}`)
        } else {
            console.log(`   ❌ Failed to get final stats: ${finalStatsResult.error}`)
        }
    } catch (error) {
        console.log(`   ❌ Error getting final stats: ${error.message}`)
    }

    console.log('\n📝 Waitlist API testing completed!\n')
}

// Run the test
testWaitlistAPI()