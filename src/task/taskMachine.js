import {
  assign,
  Machine
} from 'xstate';

// ...
// To render the statechart for this machine, copy and paste the definition below into the "Definition" panel in the 
// XState Visualizer (https://xstate.js.org/viz/).
export const taskMachine = Machine(
  {
    id: 'task',
    context: {
      taskId: undefined,
      value: undefined,
      error: undefined
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          EXECUTE: 'pending'
        }
      },
      pending: {
        entry: 'reset',
        on: {
          CANCEL: 'idle',
          EXECUTE: {
            target: 'pending',
            cond: (context, event) => context.taskId !== event.taskId
          }
        },
        invoke: {
          src: 'taskExecutor',
          onDone: {
            target: 'success',
            actions: 'handleSuccess'
          },
          onError: {
            target: 'failure',
            actions: 'handleFailure'
          }
        }
      },
      success: {
        on: {
          EXECUTE: 'pending'
        }
      },
      failure: {
        on: {
          EXECUTE: 'pending'
        }
      }
    }
  },
  {
    actions: {
      reset: assign({ 
        taskId: (_context, event) => event.taskId,
        value: undefined, 
        error: undefined 
      }),
      handleSuccess: assign({
        value: (_context, event) => event.data
      }),
      handleFailure: assign({
        error: (_context, event) => event.data
      })
    }
  }
);