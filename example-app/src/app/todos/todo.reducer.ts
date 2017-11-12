import { Todo } from './../app.state';
import { createReducer, Action } from 'typed-reducer';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todo.actions';
import { createTodo } from './create-todo';

export class TodoReducer {
    @Action 
    createTodo(state: Todo[], action: CreateTodoAction): Todo[] {
        return [ ...state, createTodo(action.payload)]
    }

    @Action
    markDone(state: Todo[], action: MarkTodoDoneAction): Todo[] {
        return state.map(todo => {
            return todo.id === action.payload ? { ...todo, done: true } : todo
        });
    }

    @Action 
    archiveTodo(state: Todo[], action: ArchiveTodoAction): Todo[] {
        return state.filter(todo => todo.id !== action.payload);
    }
}

export const todos = createReducer(TodoReducer)([]);