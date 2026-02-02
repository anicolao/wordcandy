# Event Sourcing with Redux

We strictly adhere to an **Event Sourcing** pattern using Redux and Firestore. This architecture ensures that our application state is reproducible, debuggable, and synchronizable across clients (multiplayer).

## Core Concepts

1.  **Facts on the Ground (Actions)**:
    *   We record *what happened*, not the resulting state.
    *   Example: `WORD_PLAYED` { word: "HELLO", position: {x: 7, y: 7} }, NOT `BOARD_UPDATED` { board: [...] }.
    *   Actions are "facts" that cannot be denied once validated and committed.

2.  **Reducers as Interpreters**:
    *   Reducers are pure functions that take the current state and an action to produce the new state.
    *   They "interpret" the history of actions to build the "current truth".
    *   Logic errors are fixed by rewriting reducers, not by patching the database.

3.  **Firestore as the Event Store**:
    *   We do not store the "current board state" in Firestore.
    *   We store the **stream of actions** in a `broadcast` collection.
    *   Clients subscribe to this stream and replay actions through their local reducers to reach the same state.

## Implementation Details

### The `broadcast` Collection

All significant game actions are saved to a Firestore collection named `broadcast`.

**Schema:**
```typescript
interface BroadcastAction {
  type: string;        // Redux action type (e.g., 'PLACE_TILE')
  payload: any;        // Action payload
  timestamp: FieldValue; // Server timestamp
  creator: string;     // User ID of the actor
}
```

### Writing Actions

When a user performs an action (e.g., moves a tile):
1.  **Optimistic Update**: Dispatch the action to the local Redux store immediately.
2.  **Broadcast**: Write the action to the Firestore `broadcast` collection.

```typescript
import { broadcast } from '$lib/firebase';

// In your component or thunk
async function playWord(word, position) {
  const action = { type: 'WORD_PLAYED', payload: { word, position } };
  
  // 1. Optimistic (Optional, handled by listener usually)
  // dispatch(action); 

  // 2. Persist
  await broadcast(firestore, currentUser.uid, action);
}
```

### Reading Actions

Clients subscribe to the `broadcast` collection ordered by `timestamp`.

```typescript
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';

// In your initialization logic
onSnapshot(
  query(collection(db, 'broadcast'), orderBy('timestamp')), 
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const action = change.doc.data();
        store.dispatch(action); // Replay action into Redux
      }
    });
  }
);
```

## Rules of Engagement

1.  **No Side Effects in Reducers**: Reducers must be 100% deterministic. No `Math.random()`, no `Date.now()`, no API calls.
2.  **Serializable Payloads**: Action payloads must be JSON-serializable (no functions, no class instances).
3.  **Validation**: Actions should be validated *before* being broadcast. Optionally, the server (Firestore Security Rules or Cloud Functions) validates them again.
