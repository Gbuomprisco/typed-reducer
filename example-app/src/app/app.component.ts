import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl } from '@angular/forms';
import { CreateTodoAction, MarkTodoDoneAction, ArchiveTodoAction } from './todos/todo.actions';
import { AppState, Todo } from './app.state';
import { todosSelector } from './todos/todo.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: Observable<Todo[]>;
  public form: FormGroup;
  public showDone = false;

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.todos = this.store.select(todosSelector(this.showDone));

    this.form = new FormGroup({
      title: new FormControl(''),
      description: new FormControl('')
    });
  }
  

  public toggleVisibleTodos(): void {
    this.showDone = !this.showDone;
    this.todos = this.store.select(todosSelector(this.showDone));
  }

  private getFormValues() {
    const title = this.form.get('title').value;
    const description = this.form.get('description').value;

    return { title, description };
  }

  public createTodo(): void {
    this.store.dispatch(new CreateTodoAction(this.getFormValues()));
  }

  public markDone(id: string) {
    this.store.dispatch(new MarkTodoDoneAction(id));
  }

  public archive(id: string) {
    this.store.dispatch(new ArchiveTodoAction(id));
  }
}
