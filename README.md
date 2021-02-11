# xstatewebinar
This document describes the sample React project built for the XState webinar.

## Installation
Install dependencies:

    npm install

Start the development server (available @ _localhost:3000_):

    npm start

## Overview
There are two examples in this project (see also `src/index.js`):

### task
Models and uses a state machine for a _task executor_, i.e. the ability to schedule a task (e.g. data fetching) and trace the various states of its execution.

In the state machine definition (`src/task/taskMachine.js`), it's possible to trigger an _EXECUTE_ event while in the _pending_ state, i.e. a new task may commence while a current task is running, whereby the latter will be cancelled.

The state machine will exit and then reenter the _pending_ state, but only if the following condition is fulfilled: "the new task id differs from the current task id". The task id is stored in the context; the task id equals the API URL used to fetch a user.

### agora
Uses the Agora real-time messaging (RTM) service to demonstrate simple call signalling and presence. 

To run this example:

*   [Sign up](https://sso.agora.io/en/v2/signup) to create an Agora account. 

*   Create a new Agora project and get its App ID.

    See the section [Get an App ID](https://docs.agora.io/en/Real-time-Messaging/messaging_web?platform=Web#a-nameappidaget-an-app-id).

*   Enter the App ID and a custom User ID to the corresponding environment variables in `.env`.

Open up the example and login to await a call invite.

To simulate a "host" inviting a client to a call, open the [Agora Sample App](https://webdemo.agora.io/agora-web-showcase/examples/Agora-RTM-Tutorial-Web/) and:

*   Enter the App ID.

*   Enter an _account name_ (= User ID).

    > Note: Must differ from the User ID in `.env`!

*   Login.

*   Enter a _channel name_.

*   Join.

*   Enter a Peer ID (= the User ID in `.env`).

*   Enter and Send a Peer Message. Use the above _account name_ and _channel name_ values.

    ```
    {"type":"JOIN_CALL","data":{"id": "<account name>","host":"<channel name>"}}
    ```

The example client should now receive a call invite to either refuse or accept.

Once accepted, a call session is established. It ends when either the example client clicks Leave or if the host leaves the channel. 

### Implementation Notes
The state machine (`src/agora/agoraMachine.js`) invokes a _callback based_, "long-running" service called _agoraService_ (`src/agora/agoraService.js`), which manages the interaction with Agora RTM. 

## References

*   [XState](https://xstate.js.org/)

*   [XState React bindings](https://xstate.js.org/docs/recipes/react.html)

*   [Agora RTM](https://docs.agora.io/en/Real-time-Messaging/messaging_web?platform=Web)

## Contact
marc.klefter@edument.se