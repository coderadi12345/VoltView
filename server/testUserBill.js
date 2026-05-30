const test = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@voltview.com', // wait, I need a user
        password: 'Password123!'
      })
    });
    // Wait, let's just create a new user and login
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User Bill',
        email: 'testuserbill@voltview.com',
        password: 'Password123!'
      })
    });
    const regData = await regRes.json();
    const token = regData.data.accessToken;

    console.log('User registered, creating bill...');

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = now.toISOString();

    const billRes = await fetch('http://localhost:5000/api/billing/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        periodStart,
        periodEnd,
        organization: regData.data.user.organization
      })
    });

    const billData = await billRes.json();
    console.log('Bill response:', billData);
  } catch (err) {
    console.error('Error:', err);
  }
};
test();
