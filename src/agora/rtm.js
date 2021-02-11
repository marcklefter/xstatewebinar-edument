import AgoraRtm from 'agora-rtm-sdk';

// ...

const rtmClient = AgoraRtm.createInstance(process.env.REACT_APP_AGORA_APP_ID);

let channel;

// ...

function login() {
  rtmClient.login({ 
    uid: process.env.REACT_APP_AGORA_UID
  });
}

function logout() {
  rtmClient.logout();
}

function getChannel(channelId) {
  channel = rtmClient.createChannel(channelId);

  return channel;
}

function join() {
  return channel.join();
}

function leave() {
  if (channel) {
    channel.leave();
    channel = null;
  }
}

function on(eventName, listener) {
  rtmClient.on(eventName, listener);
}

// ...

export const rtm = {
  login,
  logout,

  getChannel,

  join,
  leave,

  on
};