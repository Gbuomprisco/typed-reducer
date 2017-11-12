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

        return { [meta.type]: instance[method] };
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
 * @name Action
 */
export function Action<C, P>(instance: C, method: string, descriptor: PropertyDescriptor) {
    const types = Reflect.getMetadata('design:paramtypes', instance, method);
    const action = types[1];
    const type = new action().type;

    Reflect.defineMetadata(getMetadataKey(method), { type, action }, instance);
}


/**
 * @name getMetadataKey
 * @param instance 
 * @param method 
 */
function getMetadataKey(method: string): string {
    return `__${method}__key`;
}
