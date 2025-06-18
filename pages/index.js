import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const getUserIP = async () => {
    try {
      const res = await axios.get('https://api.ipify.org?format=json');
      return res.data.ip;
    } catch {
      return 'Unknown IP';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const strapiRes = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/auth/local`, {
        identifier: email,
        password: password
      });

      if (strapiRes.data && strapiRes.data.user) {
        const ip = await getUserIP();
        await axios.post('/api/notify-login', { email, ip });
        setStatus('Login successful and alert sent.');
      } else {
        setStatus('Login failed.');
      }
    } catch (err) {
      setStatus('Login error.');
    }

    setLoading(false);
  };

  return (
    <main style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1>🔐 Login Portal</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {status && <p style={{ marginTop: '20px' }}>{status}</p>}
    </main>
  );
}