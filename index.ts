export interface ReducerOptions { freeze: boolean }
export interface ActionReducer { type: string, payload?: any };

interface Methods<State> {[key: string]: (state: State, payload: any) => State};

const defaults: ReducerOptions = {
    freeze: false
};

/**
 * @name createReducer
 */
export function createReducer<State>(Reducer: { new(): any }, options: ReducerOptions = defaults) {
    const instance = Object.create(Reducer.prototype);
    const methods: Methods<State> = Object
        .getOwnPropertyNames(Reducer.prototype)
        .filter(method => method !== 'constructor')
        .map(method => {
            const meta = Reflect.getMetadata(method, Reducer.prototype);

            return { [meta.type]: instance[method] };
        })
        .reduce((acc: object, current: object) => ({...acc, ...current}));

    return (initialState: State): (state: State, action: ActionReducer) => State => {
        if (options.freeze) {
            Object.freeze(initialState);
        }

        return (state: State = initialState, action: ActionReducer): State => {
            const exists = methods[action.type] && typeof methods[action.type] === 'function';
            const reducer = exists ? 
                (...args: any[]): State => methods[action.type].apply(instance, args) : undefined;

            return reducer ? reducer(state, action) : state;
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

    Reflect.defineMetadata(method, { type, action }, instance);
}
