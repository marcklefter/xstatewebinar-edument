import AgoraRtm from 'agora-rtm-sdk';

import {
  rtm
} from './rtm';

// ...
// Service (callback based) invoked when the agora (parent) state machine starts.
//
// Use the "callback" function to send events to the parent machine.
export const agoraService = (_context, _event) => (callback, onReceive) => {
  rtm.on('ConnectionStateChanged', (newState, reason) => {
    const {
      ConnectionState,
      ConnectionChangeReason
    } = AgoraRtm;

    if (newState === ConnectionState.CONNECTING   && reason === ConnectionChangeReason.LOGIN) {
      return callback('CONNECT');
    }

    if (newState === ConnectionState.CONNECTED    && reason === ConnectionChangeReason.LOGIN_SUCCESS) {
      return callback('CONNECT_SUCCESS');
    }

    if (newState === ConnectionState.DISCONNECTED && reason === ConnectionChangeReason.LOGOUT) {
      return callback('DISCONNECT');
    }
  });

  rtm.on('MessageFromPeer', ({ text }, peerId) => {
    // message = { type, data }.
    const message = {
      ...JSON.parse(text),

      peerId
    };

    console.log(message);

    callback(message);
  });

  // ...
  // Events received from the parent machine.
  onReceive(async (event) => {
    switch (event.type) {
      case 'AGORA_JOIN':
        const channel = rtm.getChannel(event.channel.id);

        channel.on('ChannelMessage', ({ text }) => {
          callback(JSON.parse(text));
        });

        channel.on('MemberJoined', uid => {
          callback({
            type: 'MEMBER_JOINED',
            uid
          });
        });

        channel.on('MemberLeft', uid => {
          callback({
            type: 'MEMBER_LEFT',
            uid
          })

          // ...
          // If the channel host leaves, the call has ended.
          if (event.channel.host === uid) {
            callback('LEAVE');
          }
        });

        await rtm.join();

        callback('JOIN_SUCCESS');

        // upon joining RTM channel, get snapshot of channel members and update the parent machine.
        const uids = await channel.getMembers();
        uids.forEach(uid => callback({
          type: 'MEMBER_JOINED',
          uid
        }));

        break;

      case 'AGORA_LEAVE':
        rtm.leave();
        break;

      default:
        throw new Error(`Unknown event ${event.type}`);
    }
  });
};