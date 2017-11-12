# typed-reducer

This library is a framework-agnostic attempt to create typed reducers with Typescript following a class-based approach. Due to this, it plays particularly nicely with @ngrx. 

## Install

    npm i typed-reducer --save 

## Usage

```javascript
import { createReducer, OfAction, OfType } from 'typed-reducer';

// define an action
class MyAction {
    public type = 'ACTION_TYPE';
    constructor(public payload: string) {}
}

// create a class, each method is a branch of what we would normally do with a switch statement
export class Reducer {
    @OfAction(MyAction) // bind method to an action
    public someMethod(state: string[], action: MyAction) {
        return [ ...state, action.payload]; // return new state
    }

    // alternatively
    @OfType('ACTION_TYPE') // bind method to an action type
    public anotherMethod(state: string[], action: MyAction) {
        return [ ...state, action.payload]; // return new state
    }
}

const initialState = [];
export const reducer = createReducer(Reducer)(initialState);
```

### Full example

```javascript
import { createReducer, OfAction } from 'typed-reducer';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todo.actions';
import { createTodo } from './create-todo';

export class TodoReducer {
    @OfAction(CreateTodoAction)
    public createTodo(state: Todo[], action: CreateTodoAction) {
        return [ ...state, createTodo(action.payload)];
    }

    @OfAction(MarkTodoDoneAction)
    public markDone(state: Todo[], action: MarkTodoDoneAction) {
        return state.map(todo => {
            return todo.id === action.payload ? { ...todo, done: true } : todo
        });
    }

    @OfAction(ArchiveTodoAction)
    public archiveTodo(state: Todo[], action: ArchiveTodoAction) {
        return state.filter(todo => todo.id !== action.payload);
    }
}

const initialState = [];
export const todos = createReducer(TodoReducer)(initialState);
```

### Options
The only option available at the moment is `freeze`, which will throw errors if
a reducer attempts to mutate the state. Useful to catch errors.

```javascript
const options = { freeze: true }; // by default freeze is false
export const todos = createReducer(TodoReducer, options)(initialState);
```