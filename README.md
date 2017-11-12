# typed-reducer

This library is a framework-agnostic attempt to create typed reducers with Typescript following a class-based approach. Due to this, it plays particularly nicely with @ngrx. 

## Install

    npm i typed-reducer --save 

## Usage

```javascript
import { createReducer, Action } from 'typed-reducer';

const ACTION_TYPE = 'ACTION_TYPE';

// define an action
class MyAction {
    public type = ACTION_TYPE;
    constructor(public payload: string) {}
}

// create a class, each method is a branch of what we would normally do with a switch statement
export class Reducer {
    @Action
    public someMethod(state: string[], action: MyAction): State {
        return [ ...state, action.payload];
    }
}

const initialState = [];
export const reducer = createReducer(Reducer)(initialState);
```

### Full example

```javascript
import { createReducer, Action } from 'typed-reducer';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todo.actions';
import { createTodo } from './create-todo';

export class TodoReducer {
    @Action
    public createTodo(state: Todo[], action: CreateTodoAction): Todo[] {
        return [ ...state, createTodo(action.payload)];
    }

    @Action
    public markDone(state: Todo[], action: MarkTodoDoneAction): Todo[] {
        return state.map(todo => {
            return todo.id === action.payload ? { ...todo, done: true } : todo
        });
    }

    @Action
    public archiveTodo(state: Todo[], action: ArchiveTodoAction): Todo[] {
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

