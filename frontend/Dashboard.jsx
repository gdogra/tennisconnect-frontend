export default function Dashboard({ navigate }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Player Dashboard 🎾</h2>
      <p>Coming soon: player stats, matches, and more!</p>
      <button onClick={() => navigate('landing')}>Logout</button>
    </div>
  );
}

