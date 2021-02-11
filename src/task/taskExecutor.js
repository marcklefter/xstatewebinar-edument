import {
  ajax
} from 'rxjs/ajax';

import {
  map
} from 'rxjs/operators';

import {
  doneInvoke
} from 'xstate';

// ...
// Service to be invoked upon entering the "pending" state.
export const taskExecutor = (_context, event) => {
  // executes a "data fetching" task; uses Observables as they have cancelling semantics built-in.
  return ajax.getJSON(event.taskId).pipe(
    // upon receiving a successful response, send a "done" event back to state machine.
    map(response => doneInvoke('taskExecutor', response))
  );
}