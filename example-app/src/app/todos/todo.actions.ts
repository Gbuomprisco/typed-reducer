export const CREATE_TODO = 'CREATE_TODO';
export const MARK_DONE = 'MARK_DONE';
export const ARCHIVE_TODO = 'ARCHIVE_TODO';

export class CreateTodoAction {
    public type = CREATE_TODO;

    constructor(public payload: { title: string, description: string }) {}
}

export class MarkTodoDoneAction {
    public type = MARK_DONE;

    constructor(public payload: string) {}
}

export class ArchiveTodoAction {
    public type = ARCHIVE_TODO;

    constructor(public payload: string) {}
}

