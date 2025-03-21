export default function Register({ navigate }) {
  const handleRegister = () => navigate('dashboard');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register for TennisConnect 🎾</h2>
      <input placeholder="Name" /><br/><br/>
      <input placeholder="Email" /><br/><br/>
      <input type="password" placeholder="Password" /><br/><br/>
      <button onClick={handleRegister}>Register</button>
      <button onClick={() => navigate('landing')}>Back</button>
    </div>
  );
}

