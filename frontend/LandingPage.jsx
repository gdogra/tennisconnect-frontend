export default function LandingPage({ navigate }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to TennisConnect 🎾</h1>
      <button onClick={() => navigate('login')}>Login</button>
      <button onClick={() => navigate('register')}>Register</button>
    </div>
  );
}

