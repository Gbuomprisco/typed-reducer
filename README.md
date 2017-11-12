# typed-reducer

This library is a framework-agnostic attempt to create typed reducers with Typescript following a class-based approach. Due to this, it plays particularly nicely with @ngrx. 

## Install

    npm i typed-reducer --save 

## Usage

```javascript
import { createReducer, OfAction, OfType } from 'typed-reducer';

const ACTION_TYPE = 'ACTION_TYPE';

// define an action
class MyAction {
    public type = ACTION_TYPE;
    constructor(public payload: string) {}
}

// create a class, each method is a branch of what we would normally do with a switch statement
export class Reducer {
    @OfAction(MyAction) // bind method to an action
    public someMethod(state: string[], action: MyAction): State {
        return [ ...state, action.payload];
    }

    // alternatively
    @OfType(ACTION_TYPE) // bind method to an action type
    public anotherMethod(state: string[], action: MyAction): State {
        return [ ...state, action.payload];
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
    public createTodo(state: Todo[], action: CreateTodoAction): Todo[] {
        return [ ...state, createTodo(action.payload)];
    }

    @OfAction(MarkTodoDoneAction)
    public markDone(state: Todo[], action: MarkTodoDoneAction): Todo[] {
        return state.map(todo => {
            return todo.id === action.payload ? { ...todo, done: true } : todo
        });
    }

    @OfAction(ArchiveTodoAction)
    public archiveTodo(state: Todo[], action: ArchiveTodoAction): Todo[] {
        return state.filter(todo => todo.id !== action.payload);
    }
}

const initialState = [];
export const todos = createReducer(TodoReducer)(initialState);
```

### Type checking

Let's assume we make a mistake, and set the action type to `AnotherAction` when instead we bind reducer action
to `ArchiveTodoAction`.

```javascript
class Reducer {
    @OfAction(ArchiveTodoAction)
    public archiveTodo(state: Todo[], action: AnotherAction): Todo[] {
        return state.filter(todo => todo.id !== action.payload);
    }
}
```

What happens a runtime?

![ScreenShot](https://raw.github.com/gbuomprisco/typed-reducer/master/example-app/type-error.png)


### Options
The only option available at the moment is `freeze`, which will throw errors if
a reducer attempts to mutate the state. Useful to catch errors.

```javascript
const options = { freeze: true }; // by default freeze is false
export const todos = createReducer(TodoReducer, options)(initialState);
```

