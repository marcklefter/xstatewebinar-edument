import {
  useMachine
} from '@xstate/react';

import {
  agoraMachine
} from './agoraMachine';

import {
  agoraService
} from './agoraService';

import {
  rtm
} from './rtm';

import * as styles from './styles';

// ...

export const App = () => {
  const [state, send] = useMachine(agoraMachine, {
    services: {
      agoraService
    },

    devTools: true
  });

  // ...

  let view;
  
  switch (true) {
    case state.matches('disconnected'):
      view = <button onClick={rtm.login}>Login</button>
      break;

    case state.matches({ connected: 'idle' }):
      view = <button onClick={rtm.logout}>Logout</button>
      break;

    case state.matches({ connected: 'pending' }):
      view = (
        <div>
          <button onClick={() => send('JOIN_REFUSE')}>Refuse</button>
          <button onClick={() => send('JOIN_ACCEPT')}>Accept</button>
        </div>
      )
      break;

    case state.matches({ connected: { call: { session: 'joining' } } }):
      view = `Joining channel ${state.context.channel.id}`;
      break;

    case state.matches({ connected: { call: { session: 'joined' } } }):
      view = (
        <>
          <button style={{marginBottom: 20}} onClick={() => send('LEAVE')}>Leave</button>
          {state.context.members.map(member => <span key={member}>{member}</span>)}
        </>
      )
      break;

    default:
      view = null;
  }

  // ...

  return (
    <div style={styles.app}>
      <div style={styles.section}>
        State: {JSON.stringify(state.value)}
      </div>
      <div style={styles.section}>
        {view}
      </div>
    </div>
  )
}