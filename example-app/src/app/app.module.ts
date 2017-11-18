import { todos } from './todos/todo.selectors';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Action } from '@ngrx/store';
import { createReducer } from '../../../';
import { AppComponent } from './app.component';
import { reducer } from './todos/todo.reducer';
import { ActionReducerFactory, ActionReducerMap } from '@ngrx/store/src/models';
import { AppState } from './app.state';

const appState = {
  todos: []
};

export const rootReducer = (
  state: AppState = appState,
  action: Action
) => {
  return {
    todos: reducer(state.todos, action)
  };
};

export function reducerFactory() {
  return rootReducer;
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(undefined, {
      reducerFactory
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
