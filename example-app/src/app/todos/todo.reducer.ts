import { Todo } from './../app.state';
import { createReducer, OfAction } from '../../../../src/index';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todo.actions';
import { createTodo } from './create-todo';

export class TodoReducer {
    @OfAction(CreateTodoAction)
    public createTodo(state: Todo[], action: CreateTodoAction) {
        return [ ...state, createTodo(action.payload)]
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

export const todos = createReducer(TodoReducer)([]);