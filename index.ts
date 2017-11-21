export interface ReducerOptions {
     freeze: boolean;
     log: boolean;
}

export interface ActionReducer { type: string, payload?: any };

interface Methods<State> {[key: string]: (state: State, payload: any) => State};

const defaults: ReducerOptions = {
    freeze: false,
    log: false
};

/**
 * @name createReducer
 */
export function createReducer<State>(Reducer: { new(): any }, options: ReducerOptions = defaults) {
    const instance = Object.create(Reducer.prototype);
    const reducers = getReducerMethods(Reducer)(instance);

    return (prevState: State, action: ActionReducer): State => {
        if (options.freeze) {
            Object.freeze(prevState);
        }

        const fn = reducers[action.type];
        const exists = fn && typeof fn === 'function';
        const reducer = exists ? 
            (...args: any[]): State => fn.apply(instance, args) : undefined;
        const nextState = reducer ? reducer(prevState, action) : prevState;        

        if (options.log) {
            log(action, prevState, nextState);
        }

        return nextState;
    };
}

/**
 * @name log
 * @param action 
 * @param prevState 
 * @param nextState 
 */
function log<State>(action: ActionReducer, prevState: State, nextState: State) {
    console.log(`%caction @ ${action.type}`, 'font-weight: bold');
    console.log(`%cPREV STATE`, `font-weight: bold; color: #9E9E9E;`, prevState);
    console.log(`%cACTION`, `font-weight: bold; color: #03A9F4;`, action);
    console.log('%cNEXT STATE', `font-weight: bold; color: #4CAF50;`, nextState);
}

/**
 * 
 * @param Reducer 
 */
function getReducerMethods<State>(Reducer: { new(): any }) {
    const prototype = Reducer.prototype;
    const methods = Object.getOwnPropertyNames(prototype);

    const getMetadata = (method: string) => {
        const meta = Reflect.getMetadata('design:paramtypes', prototype, method);
        const action = meta && meta[1];

        return action ? new action().type : undefined;
    }

    return (instance: any): Methods<State> => {
        return methods
            .filter(getMetadata)
            .map((method: string) => ({ [getMetadata(method)]: instance[method] }))
            .filter(item => item)
            .reduce((acc: object, current: object) => ({...acc, ...current}), {});
    }
}

/**
 * @name Action
 */
export function Action<C, P>(instance: C, method: string, descriptor: PropertyDescriptor) {}
