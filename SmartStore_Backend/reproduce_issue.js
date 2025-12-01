const http = require('http');

async function testStoreCreation() {
    const data = JSON.stringify({
        storeId: 'teststore_' + Date.now(),
        password: 'password123',
        storeName: 'Test Store',
        ownerName: 'Test Owner',
        mobile: '1234567890',
        expiryDate: new Date().toISOString()
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/stores',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Body:', responseBody);
        });
    });

    req.on('error', (error) => {
        console.error('Error creating store:', error.message);
    });

    req.write(data);
    req.end();
}

testStoreCreation();
