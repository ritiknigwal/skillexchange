import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';

const VideoCall = ({ myUserId, userId }) => {
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
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
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
          setPeerId(id);

          if (userId) {
            fetch('/api/peer/update-peer-id', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, peerId: id })
            });
          }

          fetchAvailableUsers(userId);
        });

        // ✅ FIXED: removed undefined `id`
        peer.on('call', (call) => {
          call.answer(stream);

          currentCallRef.current = call;
          setIsCalling(true);

          const roomId = `${call.peer}-${myUserId}`;
          setChatRoom(roomId);

          setupSocket(call.peer, myUserId);

          call.on('stream', (userStream) => {
            setPeerStream(userStream);
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = userStream;
            }
          });

          call.on('close', endCall);
          call.on('error', (err) => {
            console.error('Call error:', err);
            endCall();
          });
        });

        peer.on('error', (err) => {
          console.error('PeerJS Error:', err);
        });

      })
      .catch((err) => {
        console.error('Media access error:', err);
        alert('Please allow camera and microphone access');
      });
  }, [myUserId, userId]);

  const setupSocket = (callerPeerId, peerPeerId) => {
    const socket = io('https://skillexchange-backend-dnjr.onrender.com');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-chat', {
        callerId: callerPeerId,
        peerId: peerPeerId
      });
    });

    socket.on('receive-message', (data) => {
      setChatMessages(prev => [...prev, data]);
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
  };

  const fetchAvailableUsers = async (currentUserId) => {
    try {
      const res = await fetch(`/api/peer/available-users/${currentUserId}`);
      const data = await res.json();
      setAvailableUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const callPeer = () => {
    if (!callerId || !myStream) return;

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

    call.on('close', endCall);
    call.on('error', (err) => {
      console.error(err);
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
    myStream?.getAudioTracks().forEach(track => {
      track.enabled = !audioEnabled;
    });
    setAudioEnabled(!audioEnabled);
  };

  const toggleVideo = () => {
    myStream?.getVideoTracks().forEach(track => {
      track.enabled = !videoEnabled;
    });
    setVideoEnabled(!videoEnabled);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !chatRoom) return;

    socketRef.current.emit('send-message', {
      room: chatRoom,
      message: newMessage,
      senderId: myUserId,
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
  };

  return (
    <div>
      <h2>Video Call</h2>

      <video ref={myVideoRef} autoPlay muted width="300" />
      <video ref={peerVideoRef} autoPlay width="300" />

      {!isCalling && (
        <div>
          <input
            value={callerId}
            onChange={(e) => setCallerId(e.target.value)}
            placeholder="Peer ID"
          />
          <button onClick={callPeer}>Call</button>
        </div>
      )}

      {isCalling && (
        <div>
          <button onClick={toggleAudio}>Audio</button>
          <button onClick={toggleVideo}>Video</button>
          <button onClick={endCall}>End</button>
          <button onClick={() => setShowChat(!showChat)}>
            Chat
          </button>
        </div>
      )}

      {showChat && (
        <div>
          <div style={{ height: 200, overflow: 'auto' }}>
            {chatMessages.map((msg, i) => (
              <div key={i}>
                <b>{msg.senderId}:</b> {msg.message}
              </div>
            ))}
          </div>

          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}

      <div>
        <p>My Peer ID: {peerId}</p>
      </div>
    </div>
  );
};

export default VideoCall;