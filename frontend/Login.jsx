export default function Login({ navigate }) {
  const handleLogin = () => navigate('dashboard');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login to TennisConnect 🎾</h2>
      <input placeholder="Email" /><br/><br/>
      <input type="password" placeholder="Password" /><br/><br/>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('landing')}>Back</button>
    </div>
  );
}

