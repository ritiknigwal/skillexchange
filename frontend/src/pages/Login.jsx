// After successful login, get peer ID from VideoCall and save to DB
const handleLoginSuccess = async (userData) => {
  // ... your existing login logic
  
  // Get the peer ID from VideoCall component (you'll need to pass it)
  const myPeerId = peerId; // This will come from VideoCall component
  
  // Save to backend
  await fetch('/api/peer/update-peer-id', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: {
      userId: userData._id,
      peerId: myPeerId
    }
  });
};