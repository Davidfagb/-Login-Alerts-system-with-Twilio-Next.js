// pages/test-login.js

import Head from 'next/head';
import { useState } from 'react';

export default function TestLogin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Sending login alert...');

    try {
      const ipData = await fetch('https://api.ipify.org?format=json').then(res => res.json());

      const res = await fetch('/api/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ip: ipData.ip,
        }),
      });

      const data = await res.json();
      setStatus(data.message);
    } catch (err) {
      console.error(err);
      setStatus('Error sending alert.');
    }
  };

  return (
    <>
      <Head>
        <title>Test Login Page</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div className="container">
        <h1>Simulate User Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="status">{status}</p>
      </div>
    </>
  );
}
