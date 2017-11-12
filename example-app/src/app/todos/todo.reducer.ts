import { Todo } from './../app.state';
import { createReducer, OfAction, Bind } from '../../../../src/index';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todo.actions';
import { createTodo } from './create-todo';

class AnotherAction {
    public type = 'ANOTHER_ACTION';
    public payload: any;
}

export class TodoReducer {
    @OfAction(CreateTodoAction)
    public createTodo(state: Todo[], action: CreateTodoAction): Todo[] {
        return [ ...state, createTodo(action.payload)]
    }

    @OfAction(MarkTodoDoneAction)
    public markDone(state: Todo[], action: MarkTodoDoneAction): Todo[] {
        return state.map(todo => {
            return todo.id === action.payload ? { ...todo, done: true } : todo
        });
    }

    @OfAction(ArchiveTodoAction)
    public archiveTodo(state: Todo[], action: AnotherAction): Todo[] {
        return state.filter(todo => todo.id !== action.payload);
    }
}

export const todos = createReducer(TodoReducer)([]);