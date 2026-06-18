import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';

const VideoCall = ({ myUserId, peerUserId, userId }) => {
  const [myStream, setMyStream] = useState(null);
  const [peerStream, setPeerStream] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [callerId, setCallerId] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoom, setChatRoom] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const peerRef = useRef();
  const currentCallRef = useRef(null);
  const socketRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then((stream) => {
      setMyStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      const peer = new Peer(myUserId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
        debug: 1,
      });

      peerRef.current = peer;

      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        setPeerId(id);

        if (userId) {
          fetch('/api/peer/update-peer-id', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: { userId, peerId: id }
          });
        }

        fetchAvailableUsers(userId);
      });

      peer.on('call', (call) => {
        call.answer(stream);
        currentCallRef.current = call;
        setIsCalling(true);
        setChatRoom(`${call.peer}-${id}`);

        setupSocket(call.peer, id);

        call.on('stream', (userStream) => {
          setPeerStream(userStream);
          if (peerVideoRef.current) {
            peerVideoRef.current.srcObject = userStream;
          }
        });

        call.on('close', () => {
          endCall();
        });

        call.on('error', (err) => {
          console.error('Call error:', err);
          endCall();
        });
      });

      peer.on('error', (err) => {
        console.error('PeerJS Error:', err);
      });
    }).catch((err) => {
      console.error('Media access error:', err);
      alert('Please allow camera and microphone access');
    });
  }, [myUserId, userId]);

  const setupSocket = (callerPeerId, peerPeerId) => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join-chat', {
        callerId: callerPeerId,
        peerId: peerPeerId
      });
    });

    socket.on('receive-message', (data) => {
      setChatMessages(prev => [...prev, data]);
      scrollToBottom();
    });

    socket.on('user-joined', (data) => {
      setChatMessages(prev => [...prev, {
        senderId: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('user-left', (data) => {
      setChatMessages(prev => [...prev, {
        senderId: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  };

  const fetchAvailableUsers = async (currentUserId) => {
    try {
      const res = await fetch(`/api/peer/available-users/${currentUserId}`);
      const data = await res.json();
      setAvailableUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const callPeer = () => {
    if (!callerId || !myStream) {
      alert('Please enter a Peer ID and ensure camera/mic are enabled');
      return;
    }

    const call = peerRef.current.call(callerId, myStream);
    currentCallRef.current = call;
    setIsCalling(true);
    setChatRoom(`${myUserId}-${callerId}`);

    setupSocket(myUserId, callerId);

    call.on('stream', (userStream) => {
      setPeerStream(userStream);
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = userStream;
      }
    });

    call.on('close', () => {
      endCall();
    });

    call.on('error', (err) => {
      console.error('Call error:', err);
      endCall();
    });
  };

  const endCall = () => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setIsCalling(false);
    setPeerStream(null);
    setChatMessages([]);
    setChatRoom(null);
    
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = null;
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const stopCallAndMedia = () => {
    endCall();
    
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
      });
      setMyStream(null);
    }
    
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    
    setAudioEnabled(true);
    setVideoEnabled(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !chatRoom) return;

    socketRef.current.emit('send-message', {
      room: chatRoom,
      message: newMessage.trim(),
      senderId: myUserId,
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🎥 Live Video Call with Chat</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        {/* Video Section */}
        <div style={{ flex: '1', minWidth: '320px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <h3>📹 My Video</h3>
              <video 
                ref={myVideoRef} 
                autoPlay 
                muted 
                playsInline
                style={{ 
                  width: '300px', 
                  height: '225px', 
                  border: '2px solid #333',
                  borderRadius: '8px'
                }}
              />
            </div>
            
            <div>
              <h3>👤 Peer Video</h3>
              <video 
                ref={peerVideoRef} 
                autoPlay 
                playsInline
                style={{ 
                  width: '300px', 
                  height: '225px', 
                  border: '2px solid #333',
                  borderRadius: '8px',
                  backgroundColor: peerStream ? 'transparent' : '#f0f0f0'
                }}
              />
              {!peerStream && (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '100px' }}>
                  No peer video
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          {isCalling && (
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={toggleAudio}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: audioEnabled ? '#28a745' : '#dc3545', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {audioEnabled ? '🔊 Audio On' : '🔇 Audio Off'}
              </button>

              <button 
                onClick={toggleVideo}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: videoEnabled ? '#28a745' : '#dc3545', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {videoEnabled ? '📷 Video On' : '📵 Video Off'}
              </button>

              <button 
                onClick={() => setShowChat(!showChat)}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showChat ? '📵 Hide Chat' : '💬 Show Chat'}
              </button>

              <button 
                onClick={stopCallAndMedia}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🛑 End Call & Stop
              </button>
            </div>
          )}
        </div>

        {/* Chat Section */}
        {showChat && isCalling && (
          <div style={{ 
            flex: '1', 
            minWidth: '320px', 
            maxWidth: '400px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            height: '500px'
          }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#007bff', 
              color: 'white',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              💬 Chat
            </div>
            
            <div 
              ref={chatMessagesRef}
              style={{ 
                padding: '15px',
                overflowY: 'auto',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '100px' }}>
                  No messages yet
                </div>
              )}
              
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: msg.senderId === 'system' ? '#e9ecef' : msg.isMe ? '#d4edda' : '#f8d7da',
                    padding: '10px',
                    borderRadius: '8px',
                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  {msg.senderId !== 'system' && (
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      {msg.isMe ? 'You' : 'Peer'}
                    </div>
                  )}
                  <div>{msg.message}</div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '5px', textAlign: 'right' }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              padding: '15px', 
              borderTop: '1px solid #ddd',
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: '1',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: newMessage.trim() ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call Input */}
      {!isCalling && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Enter Peer ID to call"
            value={callerId}
            onChange={(e) => setCallerId(e.target.value)}
            style={{ 
              padding: '12px', 
              width: '280px', 
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={callPeer}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📞 Call
          </button>
        </div>
      )}

      {/* Available Users */}
      {availableUsers.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          width: '100%', 
          maxWidth: '600px',
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0 }}>👥 Available Users to Call:</h3>
          {availableUsers.map((user) => (
            <div key={user._id} style={{ 
              margin: '10px 0',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}>
              <strong style={{ color: '#007bff' }}>{user.name}</strong>
              <br />
              <small style={{ color: '#666' }}>Skills: {user.skills.join(', ')}</small>
              <br />
              <small style={{ color: '#999' }}>Location: {user.location || 'Not set'}</small>
              <br />
              <button 
                onClick={() => setCallerId(user.peerId)}
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '5px',
                  cursor: 'pointer'
                }}
              >
                ✅ Set as Peer
              </button>
              <small style={{ marginLeft: '10px', color: '#666' }}>
                Peer ID: {user.peerId}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{ 
        textAlign: 'center', 
        backgroundColor: '#e9ecef', 
        padding: '15px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <p style={{ margin: '5px 0' }}>
          Your Peer ID: <strong style={{ color: '#007bff' }}>{peerId}</strong>
        </p>
        <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
          Share this with others to receive calls
        </p>
        {isCalling && (
          <p style={{ margin: '5px 0', fontSize: '13px', color: '#28a745' }}>
            ✅ Call in progress | 💬 Chat active
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoCall;