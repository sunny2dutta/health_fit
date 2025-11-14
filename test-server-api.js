const API_BASE_URL = 'http://localhost:3000'

// Test all server.js API endpoints
async function testServerAPIs() {
    console.log('🚀 Testing Server.js API Endpoints...\n')

    try {
        // Test 1: Save Email API
        console.log('1️⃣ Testing /api/save-email')
        const emailResponse = await fetch(`${API_BASE_URL}/api/save-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' })
        })
        const emailResult = await emailResponse.json()
        console.log('✅ Email API Result:', emailResult)

        // Test 2: Save Assessment API
        console.log('\n2️⃣ Testing /api/save-assessment')
        const assessmentResponse = await fetch(`${API_BASE_URL}/api/save-assessment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                personalInfo: {
                    name: 'Test User',
                    dateOfBirth: '1990-01-01',
                    phone: '+91-1234567890',
                    healthConcerns: ['General wellness'],
                    servicePreferences: ['Online consultation']
                },
                score: 75,
                answers: [
                    { question: 'Test question', selectedAnswer: 'Test answer', score: 8 }
                ]
            })
        })
        const assessmentResult = await assessmentResponse.json()
        console.log('✅ Assessment API Result:', assessmentResult)

        // Test 3: Join Waitlist API
        console.log('\n3️⃣ Testing /api/join-waitlist')
        const waitlistResponse = await fetch(`${API_BASE_URL}/api/join-waitlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'waitlist@example.com' })
        })
        const waitlistResult = await waitlistResponse.json()
        console.log('✅ Waitlist API Result:', waitlistResult)

        // Test 4: Get Waitlist Stats API
        console.log('\n4️⃣ Testing /api/waitlist-stats')
        const statsResponse = await fetch(`${API_BASE_URL}/api/waitlist-stats`)
        const statsResult = await statsResponse.json()
        console.log('✅ Waitlist Stats Result:', statsResult)

        // Test 5: Admin Login API
        console.log('\n5️⃣ Testing /api/admin/login')
        const loginResponse = await fetch(`${API_BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        })
        const loginResult = await loginResponse.json()
        console.log('✅ Admin Login Result:', loginResult)

        // Test 6: Get Users API (Admin only)
        console.log('\n6️⃣ Testing /api/users (Admin)')
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
            headers: { 'Authorization': 'Bearer admin-secret-token' }
        })
        const usersResult = await usersResponse.json()
        console.log('✅ Users API Result:', usersResult)

        // Test 7: Get Assessments API (Admin only)
        console.log('\n7️⃣ Testing /api/assessments (Admin)')
        const assessmentsResponse = await fetch(`${API_BASE_URL}/api/assessments`, {
            headers: { 'Authorization': 'Bearer admin-secret-token' }
        })
        const assessmentsResult = await assessmentsResponse.json()
        console.log('✅ Assessments API Result:', assessmentsResult)

        // Test 8: Get Stats API (Admin only)
        console.log('\n8️⃣ Testing /api/stats (Admin)')
        const adminStatsResponse = await fetch(`${API_BASE_URL}/api/stats`, {
            headers: { 'Authorization': 'Bearer admin-secret-token' }
        })
        const adminStatsResult = await adminStatsResponse.json()
        console.log('✅ Admin Stats Result:', adminStatsResult)

        console.log('\n🎉 All API tests completed successfully!')

    } catch (error) {
        console.error('❌ Test failed:', error.message)
    }
}

// Run tests
testServerAPIs()