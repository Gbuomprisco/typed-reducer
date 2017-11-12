import { Todo } from './../app.state';

export function createTodo({title, description}: {title: string, description: string}): Todo {
    return {
        title, 
        description,
        done: false,
        id: (+new Date()).toString()
    } as Todo;
}