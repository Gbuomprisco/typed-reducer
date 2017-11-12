import { Todo } from '../app.state';
import { createSelector } from '@ngrx/store';

export const todos = (state: { todos: Todo[]}) => state.todos;

export const todosSelector = (done) => createSelector(todos, (todos: Todo[]) => {
    return todos.filter(todo => todo.done === done);
});