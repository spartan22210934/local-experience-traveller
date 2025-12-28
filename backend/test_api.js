
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('Starting API Tests...');

    let token = '';
    let userId = '';
    let postId = '';
    let randomSuffix = Math.floor(Math.random() * 10000);
    const userCredentials = {
        username: `testuser${randomSuffix}`,
        email: `test${randomSuffix}@example.com`,
        password: 'password123'
    };

    // 1. Register
    try {
        console.log('\n1. Testing Registration...');
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCredentials)
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, data);
        if (res.status !== 201) throw new Error('Registration failed');
    } catch (e) {
        console.error('Registration Error:', e.message);
        return;
    }

    // 2. Login
    try {
        console.log('\n2. Testing Login...');
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userCredentials.email, password: userCredentials.password })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, data.token ? 'Token received' : 'No token');
        if (res.status !== 200 || !data.token) throw new Error('Login failed');
        token = data.token;
        userId = data.user._id;
    } catch (e) {
        console.error('Login Error:', e.message);
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 3. Get Me
    try {
        console.log('\n3. Testing Get Me...');
        const res = await fetch(`${BASE_URL}/auth/me`, {
            headers: authHeaders
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, data.email === userCredentials.email ? 'User Match' : 'User Mismatch');
    } catch (e) {
        console.error('Get Me Error:', e.message);
    }

    // 4. Create Post
    try {
        console.log('\n4. Testing Create Post...');
        const res = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Test Journey',
                description: 'This is a test post description for api testing.',
                category: 'Food',
                location: { city: 'Test City' }
            })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, data._id ? 'Post Created' : 'Failed');
        if (res.status === 201) postId = data._id;
    } catch (e) {
        console.error('Create Post Error:', e.message);
    }

    if (!postId) {
        console.log('Skipping post-related tests due to creation failure.');
        return;
    }

    // 5. Get Posts
    try {
        console.log('\n5. Testing Get All Posts...');
        const res = await fetch(`${BASE_URL}/posts`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Count: ${data.length}`);
    } catch (e) {
        console.error('Get Posts Error:', e.message);
    }

    // 6. Get Post By ID
    try {
        console.log('\n6. Testing Get Post by ID...');
        const res = await fetch(`${BASE_URL}/posts/${postId}`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, data.title === 'Test Journey' ? 'Content Match' : 'Mismatch');
    } catch (e) {
        console.error('Get Post By ID Error:', e.message);
    }

    // 7. Like Post
    try {
        console.log('\n7. Testing Like Post...');
        const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
            method: 'PATCH',
            headers: authHeaders
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Likes: ${data.likes.length}`);
    } catch (e) {
        console.error('Like Post Error:', e.message);
    }

    // 8. Upvote Post
    try {
        console.log('\n8. Testing Upvote Post...');
        const res = await fetch(`${BASE_URL}/posts/${postId}/upvote`, {
            method: 'PATCH',
            headers: authHeaders
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Upvotes: ${data.upvotes.length}`);
    } catch (e) {
        console.error('Upvote Post Error:', e.message);
    }

    // 9. Comment
    try {
        console.log('\n9. Testing Add Comment...');
        const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ text: 'Nice place!' })
        });
        const data = await res.json();
        console.log(`Status: ${res.status}`, data._id ? 'Comment Added' : 'Failed');
    } catch (e) {
        console.error('Comment Error:', e.message);
    }

    // 10. Get Comments
    try {
        console.log('\n10. Testing Get Comments...');
        const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Count: ${data.length}`);
    } catch (e) {
        console.error('Get Comments Error:', e.message);
    }

    // 11. User Posts
    try {
        console.log('\n11. Testing Get User Posts...');
        const res = await fetch(`${BASE_URL}/posts/user/${userId}`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Count: ${data.length}`);
    } catch (e) {
        console.error('User Posts Error:', e.message);
    }

    // 12. Trending
    try {
        console.log('\n12. Testing Trending...');
        const res = await fetch(`${BASE_URL}/explore/trending`);
        const data = await res.json();
        console.log(`Status: ${res.status}`, `Count: ${data.length}`);
    } catch (e) {
        console.error('Trending Error:', e.message);
    }

    console.log('\nTests Completed.');
};

runTests();
