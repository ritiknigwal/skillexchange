import React from 'react';
import VideoCall from '../components/VideoCall';
import { useAuth } from '../context/AuthContext';

const SkillMatchPage = () => {
  const { user } = useAuth();

  const myUserId = 'user-' + Math.random().toString(36).substr(2, 9);
  const userId = user?._id;
  const peerUserId = '';

  return (
    <div>
      <h1>Connect with a Skill Peer</h1>
      <VideoCall
        myUserId={myUserId}
        peerUserId={peerUserId}
        userId={userId}
      />
    </div>
  );
};

export default SkillMatchPage;