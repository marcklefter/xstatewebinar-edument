import {
  Machine,

  assign,
  send
} from 'xstate';

// ...

export const agoraMachine = Machine(
  {
    id: 'agora',
    initial: 'disconnected',
    context: {
      channel: {
        id: undefined,
        host: undefined
      },
      members: []
    },
    invoke: {
      src: 'agoraService'
    },
    states: {
      disconnected: {
        on: {
          CONNECT: 'connecting.initial'
        }
      },
      connecting: {
        on: {
          DISCONNECT: 'disconnected',
          CONNECT_FAILURE: 'disconnected'
        },
        states: {
          initial: {
            on: {
              CONNECT_SUCCESS: '#agora.connected'
            }
          },
          retry: {
            on: {
              CONNECT_SUCCESS: '#agora.connected.hist'
            }
          }
        }
      },
      connected: {
        initial: 'idle',
        on: {
          INTERRUPT: 'connecting.retry',
          DISCONNECT: 'disconnected'
        },
        states: {
          idle: {
            entry: 'reset',
            on: {
              JOIN_CALL: {
                target: 'pending',
                actions: 'setChannel'
              }
            }
          },
          pending: {
            on: {
              JOIN_REFUSE: 'idle',
              JOIN_ACCEPT: 'call'
            }
          },
          call: {
            entry: 'join',
            type: 'parallel',
            states: {
              session: {
                initial: 'joining',
                on: {
                  MEMBER_JOINED: {
                    actions: 'memberJoined'
                  },

                  MEMBER_LEFT: {
                    actions: 'memberLeft'
                  }
                },
                states: {
                  joining: {
                    on: {
                      JOIN_SUCCESS: 'joined'
                    }
                  },
                  joined: {
                    exit: 'leave',
                    on: {
                      LEAVE: '#agora.connected.idle'
                    }
                  }
                }
              },
              stream: {}
            }
          },
          hist: {
            type: 'history'
          }
        }
      }
    }
  },
  {
    actions: {
      reset: assign((_context, _event) => ({
        channel: {
          id: undefined,
          host: undefined
        },
        members: []
      })),

      setChannel: assign({
        channel: (_context, event) => event.data
      }),

      join: send(context => ({
        type: 'AGORA_JOIN',
        channel: context.channel
      }),
        {
          to: 'agoraService'
        }),

      leave: send(
        'AGORA_LEAVE',
        {
          to: 'agoraService'
        }
      ),

      memberJoined: assign({
        members: (context, { uid }) => {
          return [
            ...context.members,
            uid
          ];
        }
      }),

      memberLeft: assign({
        members: (context, { uid }) => context.members.filter(member => member !== uid)
      })
    }
  }
);