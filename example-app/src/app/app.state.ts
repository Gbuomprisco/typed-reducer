export interface Todo {
    description: string;
    title: string;
    id: string;
    done: boolean;
}

export interface AppState {
    todos: Todo[];
}