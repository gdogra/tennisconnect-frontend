useEffect(() => {
  const fetchRankings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/dashboard/player-rankings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRankings(data);
      } else {
        setError(data.error || "Failed to fetch rankings.");
      }
    } catch (err) {
      setError("❌ Network error while fetching player rankings.");
    } finally {
      setLoading(false);
    }
  };

  fetchRankings();
}, []);

