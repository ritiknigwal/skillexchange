import express from 'express';
import { ExpressPeerServer } from 'peer';

const app = express();

const server = app.listen(9000, () => {
  console.log('PeerJS server running on port 9000');
});

const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);