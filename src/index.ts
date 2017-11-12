export interface Options {
  freeze: boolean;
}

export interface Action { type: string, payload?: any };
export interface Methods<State> {[key: string]: (state: State, payload: any) => State};

const defaults: Options = {
  freeze: false
};

/**
 * @name createReducer
 */
export function createReducer<State>(Reducer: { new(): any }, options: Options = defaults) {
  const instance = Object.create(Reducer.prototype);

  const methods: Methods<State> = Object
    .getOwnPropertyNames(Reducer.prototype)
    .filter(method => method !== 'constructor')
    .map(method => {
      const key = getMetadataKey(method);
      const meta = Reflect.getMetadata(key, Reducer.prototype);
      return { [meta]: instance[method] };
    })
    .reduce((acc: object, current: object) => ({...acc, ...current}));

  return (initialState: State): (state: State, action: Action) => State => {
    if (options.freeze) {
      Object.freeze(initialState);
    }

    return (state: State = initialState, action: Action): State => {
      const fn = (...args: any[]): State => methods[action.type].apply(instance, args);
      const hasMethod = methods[action.type] && typeof methods[action.type] === 'function';

      if (hasMethod) {
        return fn(state, action);
      }

      return state;
    };
  }
}

/**
 * @name OfType
 * @param type {string}
 */
export function OfType<C>(type: string) {
  return function (instance: C, method: string): void {
    Reflect.defineMetadata(getMetadataKey(method), type, instance);
  }
}

/**
 * @name OfAction
 * @param action {string}
 */
export function OfAction<C, P, A extends Action>(action: new (payload?: P) => A) {
  return function (instance: C, method: string, descriptor: PropertyDescriptor): void {
    const type: string = new action().type;
    const value = descriptor.value;

    Reflect.defineMetadata(getMetadataKey(method), type, instance);

    descriptor.value = function () {
        const types = Reflect.getMetadata('design:paramtypes', instance, method);

        if (types[1] && arguments[1] instanceof types[1] === false) {
          throw new Error(`Invalid action, expected instance of ${action.name}`);
        }

        return value.apply(this, arguments);
    }
  }
}

/**
 * @name getMetadataKey
 * @param instance 
 * @param method 
 */
function getMetadataKey(method: string): string {
  return `__${method}__key`;
}