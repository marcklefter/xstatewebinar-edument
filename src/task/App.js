import {
  useState
} from 'react';

import {
  useMachine
} from '@xstate/react';

import {
  taskExecutor
} from './taskExecutor';

import {
  taskMachine
} from './taskMachine';

import * as styles from './styles';

// ...

// ...

export const App = () => {
  const [state, send] = useMachine(taskMachine, {
    services: {
      taskExecutor
    },

    devTools: true
  });

  const [userId, setUserId] = useState(1);

  // ...

  const handleSubmit = e => {
    // trigger a transition to the "pending" state. 
    send('EXECUTE', {
      taskId: `https://jsonplaceholder.typicode.com/users/${userId}`
    });
  };

  const handleCancel = () => {
    // if current state is "pending", trigger a transition to the "idle" state.
    send('CANCEL');
  };

  const handleChange = e => {
    setUserId(+e.target.value);
  };

  // ...

  return (
    <div style={styles.wrapper}>
      <div>
        <input
          type="number"
          value={userId}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Fetch User</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>

      <div style={styles.resultsWrapper}>
        <div style={styles.results}>
          {/* match ("switch") on the state the state machine is currently in, and render accordingly. */}
          {state.matches('pending') && 'Loading...'}
          {state.matches('failure') && `Could not fetch user ${userId} (${state.context.error.message})`}
          {state.matches('success') && `Name: ${state.context.value.name}`}
        </div>
      </div>
    </div>
  )
}