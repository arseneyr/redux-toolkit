import { Action } from 'redux';
import { ActionCreator } from 'redux';
import { AnyAction } from 'redux';
import { default as createNextState } from 'immer';
import { createSelector } from 'reselect';
import { current } from 'immer';
import { DeepPartial } from 'redux';
import { Dispatch } from 'redux';
import { Draft } from 'immer';
import { Middleware } from 'redux';
import { OutputParametricSelector } from 'reselect';
import { OutputSelector } from 'reselect';
import { ParametricSelector } from 'reselect';
import { Reducer } from 'redux';
import { ReducersMapObject } from 'redux';
import { Selector } from 'reselect';
import { Store } from 'redux';
import { StoreEnhancer } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ThunkDispatch } from 'redux-thunk';
import { ThunkMiddleware } from 'redux-thunk';

/**
 * Get a `PayloadActionCreator` type for a passed `CaseReducer`
 *
 * @internal
 */
declare type ActionCreatorForCaseReducer<CR> = CR extends (state: any, action: infer Action) => any ? Action extends {
    payload: infer P;
} ? PayloadActionCreator<P> : ActionCreatorWithoutPayload : ActionCreatorWithoutPayload;

/**
 * Get a `PayloadActionCreator` type for a passed `CaseReducerWithPrepare`
 *
 * @internal
 */
declare type ActionCreatorForCaseReducerWithPrepare<CR extends {
    prepare: any;
}> = _ActionCreatorWithPreparedPayload<CR['prepare'], string>;

/**
 * An action creator of type `T` whose `payload` type could not be inferred. Accepts everything as `payload`.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export declare interface ActionCreatorWithNonInferrablePayload<T extends string = string> extends BaseActionCreator<unknown, T> {
    /**
     * Calling this {@link redux#ActionCreator} with an argument will
     * return a {@link PayloadAction} of type `T` with a payload
     * of exactly the type of the argument.
     */
    <PT extends unknown>(payload: PT): PayloadAction<PT, T>;
}

/**
 * An action creator of type `T` that takes an optional payload of type `P`.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export declare interface ActionCreatorWithOptionalPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    /**
     * Calling this {@link redux#ActionCreator} with an argument will
     * return a {@link PayloadAction} of type `T` with a payload of `P`.
     * Calling it without an argument will return a PayloadAction with a payload of `undefined`.
     */
    (payload?: P): PayloadAction<P, T>;
}

/**
 * An action creator of type `T` that takes no payload.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export declare interface ActionCreatorWithoutPayload<T extends string = string> extends BaseActionCreator<undefined, T> {
    /**
     * Calling this {@link redux#ActionCreator} will
     * return a {@link PayloadAction} of type `T` with a payload of `undefined`
     */
    (): PayloadAction<undefined, T>;
}

/**
 * An action creator of type `T` that requires a payload of type P.
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export declare interface ActionCreatorWithPayload<P, T extends string = string> extends BaseActionCreator<P, T> {
    /**
     * Calling this {@link redux#ActionCreator} with an argument will
     * return a {@link PayloadAction} of type `T` with a payload of `P`
     */
    (payload: P): PayloadAction<P, T>;
}

/**
 * An action creator that takes multiple arguments that are passed
 * to a `PrepareAction` method to create the final Action.
 * @typeParam Args arguments for the action creator function
 * @typeParam P `payload` type
 * @typeParam T `type` name
 * @typeParam E optional `error` type
 * @typeParam M optional `meta` type
 *
 * @inheritdoc {redux#ActionCreator}
 *
 * @public
 */
export declare interface ActionCreatorWithPreparedPayload<Args extends unknown[], P, T extends string = string, E = never, M = never> extends BaseActionCreator<P, T, M, E> {
    /**
     * Calling this {@link redux#ActionCreator} with `Args` will return
     * an Action with a payload of type `P` and (depending on the `PrepareAction`
     * method used) a `meta`- and `error` property of types `M` and `E` respectively.
     */
    (...args: Args): PayloadAction<P, T, M, E>;
}

/**
 * Internal version of `ActionCreatorWithPreparedPayload`. Not to be used externally.
 *
 * @internal
 */
declare type _ActionCreatorWithPreparedPayload<PA extends PrepareAction<any> | void, T extends string = string> = PA extends PrepareAction<infer P> ? ActionCreatorWithPreparedPayload<Parameters<PA>, P, T, ReturnType<PA> extends {
    error: infer E;
} ? E : never, ReturnType<PA> extends {
    meta: infer M;
} ? M : never> : void;

declare interface ActionMatcher<A extends AnyAction> {
    (action: AnyAction): action is A;
}

declare type ActionMatcherDescription<S, A extends AnyAction> = {
    matcher: ActionMatcher<A>;
    reducer: CaseReducer<S, NoInfer<A>>;
};

declare type ActionMatcherDescriptionCollection<S> = Array<ActionMatcherDescription<S, any>>;

/**
 * A builder for an action <-> reducer map.
 *
 * @public
 */
export declare interface ActionReducerMapBuilder<State> {
    /**
     * Add a case reducer for actions created by this action creator.
     * @param actionCreator
     * @param reducer
     */
    addCase<ActionCreator extends TypedActionCreator<string>>(actionCreator: ActionCreator, reducer: CaseReducer<State, ReturnType<ActionCreator>>): ActionReducerMapBuilder<State>;
    /**
     * Add a case reducer for actions with the specified type.
     * @param type
     * @param reducer
     */
    addCase<Type extends string, A extends Action<Type>>(type: Type, reducer: CaseReducer<State, A>): ActionReducerMapBuilder<State>;
    /**
     * Adds a reducer for all actions, using `matcher` as a filter function.
     * If multiple matcher reducers match, all of them will be executed in the order
     * they were defined if - even if a case reducer already matched.
     * @param matcher A matcher function. In TypeScript, this should be a [type predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates)
     *   function
     * @param reducer
     */
    addMatcher<A extends AnyAction>(matcher: ActionMatcher<A>, reducer: CaseReducer<State, A>): Omit<ActionReducerMapBuilder<State>, 'addCase'>;
    /**
     * Adds a "default case" reducer that is executed if no case reducer and no matcher
     * reducer was executed for this action.
     * @param reducer
     */
    addDefaultCase(reducer: CaseReducer<State, AnyAction>): {};
}

/**
 * Defines a mapping from action types to corresponding action object shapes.
 *
 * @deprecated This should not be used manually - it is only used for internal
 *             inference purposes and should not have any further value.
 *             It might be removed in the future.
 * @public
 */
export declare type Actions<T extends keyof any = string> = Record<T, Action>;

declare type ActionTypesWithOptionalErrorAction = {
    error: any;
} | {
    error?: never;
    payload: any;
};

/**
 * A type describing the return value of `createAsyncThunk`.
 * Might be useful for wrapping `createAsyncThunk` in custom abstractions.
 *
 * @public
 */
export declare type AsyncThunk<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> & {
    pending: AsyncThunkPendingActionCreator<ThunkArg>;
    rejected: AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>;
    fulfilled: AsyncThunkFulfilledActionCreator<Returned, ThunkArg>;
    typePrefix: string;
};

/**
 * A ThunkAction created by `createAsyncThunk`.
 * Dispatching it returns a Promise for either a
 * fulfilled or rejected action.
 * Also, the returned value contains a `abort()` method
 * that allows the asyncAction to be cancelled from the outside.
 *
 * @public
 */
export declare type AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = (dispatch: GetDispatch<ThunkApiConfig>, getState: () => GetState<ThunkApiConfig>, extra: GetExtra<ThunkApiConfig>) => Promise<PayloadAction<Returned, string, {
    arg: ThunkArg;
    requestId: string;
}> | PayloadAction<undefined | GetRejectValue<ThunkApiConfig>, string, {
    arg: ThunkArg;
    requestId: string;
    aborted: boolean;
    condition: boolean;
}, SerializedError>> & {
    abort(reason?: string): void;
};

declare type AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = IsAny<ThunkArg, (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>, unknown extends ThunkArg ? (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig> : [ThunkArg] extends [void] | [undefined] ? () => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig> : [void] extends [ThunkArg] ? (arg?: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig> : [undefined] extends [ThunkArg] ? WithStrictNullChecks<(arg?: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>, (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>> : (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>>;

declare type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
};

declare type AsyncThunkFulfilledActionCreator<Returned, ThunkArg> = ActionCreatorWithPreparedPayload<[Returned, string, ThunkArg], Returned, string, never, {
    arg: ThunkArg;
    requestId: string;
}>;

declare interface AsyncThunkOptions<ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}> {
    /**
     * A method to control whether the asyncThunk should be executed. Has access to the
     * `arg`, `api.getState()` and `api.extra` arguments.
     *
     * @returns `false` if it should be skipped
     */
    condition?(arg: ThunkArg, api: Pick<GetThunkAPI<ThunkApiConfig>, 'getState' | 'extra'>): boolean | undefined;
    /**
     * If `condition` returns `false`, the asyncThunk will be skipped.
     * This option allows you to control whether a `rejected` action with `meta.condition == false`
     * will be dispatched or not.
     *
     * @default `false`
     */
    dispatchConditionRejection?: boolean;
}

/**
 * A type describing the `payloadCreator` argument to `createAsyncThunk`.
 * Might be useful for wrapping `createAsyncThunk` in custom abstractions.
 *
 * @public
 */
export declare type AsyncThunkPayloadCreator<Returned, ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}> = (arg: ThunkArg, thunkAPI: GetThunkAPI<ThunkApiConfig>) => AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig>;

/**
 * A type describing the return value of the `payloadCreator` argument to `createAsyncThunk`.
 * Might be useful for wrapping `createAsyncThunk` in custom abstractions.
 *
 * @public
 */
export declare type AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig extends AsyncThunkConfig> = Promise<Returned | RejectWithValue<GetRejectValue<ThunkApiConfig>>> | Returned | RejectWithValue<GetRejectValue<ThunkApiConfig>>;

declare type AsyncThunkPendingActionCreator<ThunkArg> = ActionCreatorWithPreparedPayload<[string, ThunkArg], undefined, string, never, {
    arg: ThunkArg;
    requestId: string;
}>;

declare type AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig> = ActionCreatorWithPreparedPayload<[Error | null, string, ThunkArg, (GetRejectValue<ThunkApiConfig> | undefined)?], GetRejectValue<ThunkApiConfig> | undefined, string, SerializedError, {
    arg: ThunkArg;
    requestId: string;
    aborted: boolean;
    condition: boolean;
}>;

/**
 * returns True if TS version is above 3.5, False if below.
 * uses feature detection to detect TS version >= 3.5
 * * versions below 3.5 will return `{}` for unresolvable interference
 * * versions above will return `unknown`
 *
 * @internal
 */
declare type AtLeastTS35<True, False> = [True, False][IsUnknown<ReturnType<(<T>() => T)>, 0, 1>];

/**
 * Basic type for all action creators.
 *
 * @inheritdoc {redux#ActionCreator}
 */
declare interface BaseActionCreator<P, T extends string, M = never, E = never> {
    type: T;
    match(action: Action<unknown>): action is PayloadAction<P, T, M, E>;
}

declare type BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined> = {
    dispatch: D;
    getState: () => S;
    extra: E;
    requestId: string;
    signal: AbortSignal;
    rejectWithValue(value: RejectedValue): RejectWithValue<RejectedValue>;
};

/**
 * An *case reducer* is a reducer function for a specific action type. Case
 * reducers can be composed to full reducers using `createReducer()`.
 *
 * Unlike a normal Redux reducer, a case reducer is never called with an
 * `undefined` state to determine the initial state. Instead, the initial
 * state is explicitly specified as an argument to `createReducer()`.
 *
 * In addition, a case reducer can choose to mutate the passed-in `state`
 * value directly instead of returning a new state. This does not actually
 * cause the store state to be mutated directly; instead, thanks to
 * [immer](https://github.com/mweststrate/immer), the mutations are
 * translated to copy operations that result in a new state.
 *
 * @public
 */
export declare type CaseReducer<S = any, A extends Action = AnyAction> = (state: Draft<S>, action: A) => S | void;

/**
 * Derives the slice's `actions` property from the `reducers` options
 *
 * @public
 */
export declare type CaseReducerActions<CaseReducers extends SliceCaseReducers<any>> = {
    [Type in keyof CaseReducers]: CaseReducers[Type] extends {
        prepare: any;
    } ? ActionCreatorForCaseReducerWithPrepare<CaseReducers[Type]> : ActionCreatorForCaseReducer<CaseReducers[Type]>;
};

/**
 * A mapping from action types to case reducers for `createReducer()`.
 *
 * @deprecated This should not be used manually - it is only used
 *             for internal inference purposes and using it manually
 *             would lead to type erasure.
 *             It might be removed in the future.
 * @public
 */
export declare type CaseReducers<S, AS extends Actions> = {
    [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void;
};

/**
 * A CaseReducer with a `prepare` method.
 *
 * @public
 */
export declare type CaseReducerWithPrepare<State, Action extends PayloadAction> = {
    reducer: CaseReducer<State, Action>;
    prepare: PrepareAction<Action['payload']>;
};

/**
 * @public
 */
export declare type Comparer<T> = (a: T, b: T) => number;

/**
 * Callback function type, to be used in `ConfigureStoreOptions.enhancers`
 *
 * @public
 */
export declare type ConfigureEnhancersCallback = (defaultEnhancers: StoreEnhancer[]) => StoreEnhancer[];

/**
 * A friendly abstraction over the standard Redux `createStore()` function.
 *
 * @param config The store configuration.
 * @returns A configured Redux store.
 *
 * @public
 */
export declare function configureStore<S = any, A extends Action = AnyAction, M extends Middlewares<S> = [ThunkMiddlewareFor<S>]>(options: ConfigureStoreOptions<S, A, M>): EnhancedStore<S, A, M>;

/**
 * Options for `configureStore()`.
 *
 * @public
 */
export declare interface ConfigureStoreOptions<S = any, A extends Action = AnyAction, M extends Middlewares<S> = Middlewares<S>> {
    /**
     * A single reducer function that will be used as the root reducer, or an
     * object of slice reducers that will be passed to `combineReducers()`.
     */
    reducer: Reducer<S, A> | ReducersMapObject<S, A>;
    /**
     * An array of Redux middleware to install. If not supplied, defaults to
     * the set of middleware returned by `getDefaultMiddleware()`.
     */
    middleware?: ((getDefaultMiddleware: CurriedGetDefaultMiddleware<S>) => M) | M;
    /**
     * Whether to enable Redux DevTools integration. Defaults to `true`.
     *
     * Additional configuration can be done by passing Redux DevTools options
     */
    devTools?: boolean | EnhancerOptions;
    /**
     * The initial state, same as Redux's createStore.
     * You may optionally specify it to hydrate the state
     * from the server in universal apps, or to restore a previously serialized
     * user session. If you use `combineReducers()` to produce the root reducer
     * function (either directly or indirectly by passing an object as `reducer`),
     * this must be an object with the same shape as the reducer map keys.
     */
    preloadedState?: DeepPartial<S extends any ? S : S>;
    /**
     * The store enhancers to apply. See Redux's `createStore()`.
     * All enhancers will be included before the DevTools Extension enhancer.
     * If you need to customize the order of enhancers, supply a callback
     * function that will receive the original array (ie, `[applyMiddleware]`),
     * and should return a new array (such as `[applyMiddleware, offline]`).
     * If you only need to add middleware, you can use the `middleware` parameter instead.
     */
    enhancers?: StoreEnhancer[] | ConfigureEnhancersCallback;
}

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass it's arguments to this method to calculate payload & meta.
 *
 * @public
 */
export declare function createAction<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>;

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass it's arguments to this method to calculate payload & meta.
 *
 * @public
 */
export declare function createAction<PA extends PrepareAction<any>, T extends string = string>(type: T, prepareAction: PA): PayloadActionCreator<ReturnType<PA>['payload'], T, PA>;

/**
 *
 * @param typePrefix
 * @param payloadCreator
 * @param options
 *
 * @public
 */
export declare function createAsyncThunk<Returned, ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>, options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

/**
 *
 * @param options
 *
 * @public
 */
export declare function createEntityAdapter<T>(options?: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
}): EntityAdapter<T>;

/**
 * Creates a middleware that checks whether any state was mutated in between
 * dispatches or during a dispatch. If any mutations are detected, an error is
 * thrown.
 *
 * @param options Middleware options.
 *
 * @public
 */
export declare function createImmutableStateInvariantMiddleware(options?: ImmutableStateInvariantMiddlewareOptions): Middleware;
export { createNextState }

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * The body of every case reducer is implicitly wrapped with a call to
 * `produce()` from the [immer](https://github.com/mweststrate/immer) library.
 * This means that rather than returning a new state object, you can also
 * mutate the passed-in state object directly; these mutations will then be
 * automatically and efficiently translated into copies, giving you both
 * convenience and immutability.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param actionsMap A mapping from action types to action-type-specific
 *   case reducers.
 * @param actionMatchers An array of matcher definitions in the form `{matcher, reducer}`.
 *   All matching reducers will be executed in order, independently if a case reducer matched or not.
 * @param defaultCaseReducer A "default case" reducer that is executed if no case reducer and no matcher
 *   reducer was executed for this action.
 *
 * @public
 */
export declare function createReducer<S, CR extends CaseReducers<S, any> = CaseReducers<S, any>>(initialState: S, actionsMap: CR, actionMatchers?: ActionMatcherDescriptionCollection<S>, defaultCaseReducer?: CaseReducer<S>): Reducer<S>;

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * The body of every case reducer is implicitly wrapped with a call to
 * `produce()` from the [immer](https://github.com/mweststrate/immer) library.
 * This means that rather than returning a new state object, you can also
 * mutate the passed-in state object directly; these mutations will then be
 * automatically and efficiently translated into copies, giving you both
 * convenience and immutability.
 * @param initialState The initial state to be returned by the reducer.
 * @param builderCallback A callback that receives a *builder* object to define
 *   case reducers via calls to `builder.addCase(actionCreatorOrType, reducer)`.
 *
 * @public
 */
export declare function createReducer<S>(initialState: S, builderCallback: (builder: ActionReducerMapBuilder<S>) => void): Reducer<S>;
export { createSelector }

/**
 * Creates a middleware that, after every state change, checks if the new
 * state is serializable. If a non-serializable value is found within the
 * state, an error is printed to the console.
 *
 * @param options Middleware options.
 *
 * @public
 */
export declare function createSerializableStateInvariantMiddleware(options?: SerializableStateInvariantMiddlewareOptions): Middleware;

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "slice name", and automatically generates
 * action creators and action types that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 *
 * @public
 */
export declare function createSlice<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name>): Slice<State, CaseReducers, Name>;

/**
 * Options for `createSlice()`.
 *
 * @public
 */
export declare interface CreateSliceOptions<State = any, CR extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string> {
    /**
     * The slice's name. Used to namespace the generated action types.
     */
    name: Name;
    /**
     * The initial state to be returned by the slice reducer.
     */
    initialState: State;
    /**
     * A mapping from action types to action-type-specific *case reducer*
     * functions. For every action type, a matching action creator will be
     * generated using `createAction()`.
     */
    reducers: ValidateSliceCaseReducers<State, CR>;
    /**
     * A mapping from action types to action-type-specific *case reducer*
     * functions. These reducers should have existing action types used
     * as the keys, and action creators will _not_ be generated.
     * Alternatively, a callback that receives a *builder* object to define
     * case reducers via calls to `builder.addCase(actionCreatorOrType, reducer)`.
     */
    extraReducers?: CaseReducers<NoInfer<State>, any> | ((builder: ActionReducerMapBuilder<NoInfer<State>>) => void);
}
export { current }

declare type CurriedGetDefaultMiddleware<S = any> = <O extends Partial<GetDefaultMiddlewareOptions> = {
    thunk: true;
    immutableCheck: true;
    serializableCheck: true;
}>(options?: O) => MiddlewareArray<Middleware<{}, S> | ThunkMiddlewareFor<S, O>>;

/**
 * @public
 */
export declare interface Dictionary<T> extends DictionaryNum<T> {
    [id: string]: T | undefined;
}

/**
 * @public
 */
declare interface DictionaryNum<T> {
    [id: number]: T | undefined;
}

/**
 * Combines all dispatch signatures of all middlewares in the array `M` into
 * one intersected dispatch signature.
 */
declare type DispatchForMiddlewares<M> = M extends ReadonlyArray<any> ? UnionToIntersection<M[number] extends infer MiddlewareValues ? MiddlewareValues extends Middleware<infer DispatchExt, any, any> ? DispatchExt extends Function ? DispatchExt : never : never : never> : never;
export { Draft }

/**
 * A Redux store returned by `configureStore()`. Supports dispatching
 * side-effectful _thunks_ in addition to plain actions.
 *
 * @public
 */
export declare interface EnhancedStore<S = any, A extends Action = AnyAction, M extends Middlewares<S> = Middlewares<S>> extends Store<S, A> {
    /**
     * The `dispatch` method of your store, enhanced by all it's middlewares.
     *
     * @inheritdoc
     */
    dispatch: DispatchForMiddlewares<M> & Dispatch<A>;
}

/**
 * @public
 */
declare interface EnhancerOptions {
    /**
     * the instance name to be showed on the monitor page. Default value is `document.title`.
     * If not specified and there's no document title, it will consist of `tabId` and `instanceId`.
     */
    name?: string;
    /**
     * action creators functions to be available in the Dispatcher.
     */
    actionCreators?: ActionCreator<any>[] | {
        [key: string]: ActionCreator<any>;
    };
    /**
     * if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once.
     * It is the joint between performance and speed. When set to `0`, all actions will be sent instantly.
     * Set it to a higher value when experiencing perf issues (also `maxAge` to a lower value).
     *
     * @default 500 ms.
     */
    latency?: number;
    /**
     * (> 1) - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance.
     *
     * @default 50
     */
    maxAge?: number;
    /**
     * - `undefined` - will use regular `JSON.stringify` to send data (it's the fast mode).
     * - `false` - will handle also circular references.
     * - `true` - will handle also date, regex, undefined, error objects, symbols, maps, sets and functions.
     * - object, which contains `date`, `regex`, `undefined`, `error`, `symbol`, `map`, `set` and `function` keys.
     *   For each of them you can indicate if to include (by setting as `true`).
     *   For `function` key you can also specify a custom function which handles serialization.
     *   See [`jsan`](https://github.com/kolodny/jsan) for more details.
     */
    serialize?: boolean | {
        date?: boolean;
        regex?: boolean;
        undefined?: boolean;
        error?: boolean;
        symbol?: boolean;
        map?: boolean;
        set?: boolean;
        function?: boolean | Function;
    };
    /**
     * function which takes `action` object and id number as arguments, and should return `action` object back.
     */
    actionSanitizer?: <A extends Action>(action: A, id: number) => A;
    /**
     * function which takes `state` object and index as arguments, and should return `state` object back.
     */
    stateSanitizer?: <S>(state: S, index: number) => S;
    /**
     * *string or array of strings as regex* - actions types to be hidden / shown in the monitors (while passed to the reducers).
     * If `actionsWhitelist` specified, `actionsBlacklist` is ignored.
     */
    actionsBlacklist?: string | string[];
    /**
     * *string or array of strings as regex* - actions types to be hidden / shown in the monitors (while passed to the reducers).
     * If `actionsWhitelist` specified, `actionsBlacklist` is ignored.
     */
    actionsWhitelist?: string | string[];
    /**
     * called for every action before sending, takes `state` and `action` object, and returns `true` in case it allows sending the current data to the monitor.
     * Use it as a more advanced version of `actionsBlacklist`/`actionsWhitelist` parameters.
     */
    predicate?: <S, A extends Action>(state: S, action: A) => boolean;
    /**
     * if specified as `false`, it will not record the changes till clicking on `Start recording` button.
     * Available only for Redux enhancer, for others use `autoPause`.
     *
     * @default true
     */
    shouldRecordChanges?: boolean;
    /**
     * if specified, whenever clicking on `Pause recording` button and there are actions in the history log, will add this action type.
     * If not specified, will commit when paused. Available only for Redux enhancer.
     *
     * @default "@@PAUSED""
     */
    pauseActionType?: string;
    /**
     * auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use.
     * Not available for Redux enhancer (as it already does it but storing the data to be sent).
     *
     * @default false
     */
    autoPause?: boolean;
    /**
     * if specified as `true`, it will not allow any non-monitor actions to be dispatched till clicking on `Unlock changes` button.
     * Available only for Redux enhancer.
     *
     * @default false
     */
    shouldStartLocked?: boolean;
    /**
     * if set to `false`, will not recompute the states on hot reloading (or on replacing the reducers). Available only for Redux enhancer.
     *
     * @default true
     */
    shouldHotReload?: boolean;
    /**
     * if specified as `true`, whenever there's an exception in reducers, the monitors will show the error message, and next actions will not be dispatched.
     *
     * @default false
     */
    shouldCatchErrors?: boolean;
    /**
     * If you want to restrict the extension, specify the features you allow.
     * If not specified, all of the features are enabled. When set as an object, only those included as `true` will be allowed.
     * Note that except `true`/`false`, `import` and `export` can be set as `custom` (which is by default for Redux enhancer), meaning that the importing/exporting occurs on the client side.
     * Otherwise, you'll get/set the data right from the monitor part.
     */
    features?: {
        /**
         * start/pause recording of dispatched actions
         */
        pause?: boolean;
        /**
         * lock/unlock dispatching actions and side effects
         */
        lock?: boolean;
        /**
         * persist states on page reloading
         */
        persist?: boolean;
        /**
         * export history of actions in a file
         */
        export?: boolean | 'custom';
        /**
         * import history of actions from a file
         */
        import?: boolean | 'custom';
        /**
         * jump back and forth (time travelling)
         */
        jump?: boolean;
        /**
         * skip (cancel) actions
         */
        skip?: boolean;
        /**
         * drag and drop actions in the history list
         */
        reorder?: boolean;
        /**
         * dispatch custom actions or action creators
         */
        dispatch?: boolean;
        /**
         * generate tests for the selected actions
         */
        test?: boolean;
    };
    /**
     * Set to true or a stacktrace-returning function to record call stack traces for dispatched actions.
     * Defaults to false.
     */
    trace?: boolean | (<A extends Action>(action: A) => string);
    /**
     * The maximum number of stack trace entries to record per action. Defaults to 10.
     */
    traceLimit?: number;
}

/**
 * @public
 */
export declare interface EntityAdapter<T> extends EntityStateAdapter<T> {
    selectId: IdSelector<T>;
    sortComparer: false | Comparer<T>;
    getInitialState(): EntityState<T>;
    getInitialState<S extends object>(state: S): EntityState<T> & S;
    getSelectors(): EntitySelectors<T, EntityState<T>>;
    getSelectors<V>(selectState: (state: V) => EntityState<T>): EntitySelectors<T, V>;
}

/**
 * @public
 */
export declare type EntityId = number | string;

/**
 * @public
 */
export declare interface EntitySelectors<T, V> {
    selectIds: (state: V) => EntityId[];
    selectEntities: (state: V) => Dictionary<T>;
    selectAll: (state: V) => T[];
    selectTotal: (state: V) => number;
    selectById: (state: V, id: EntityId) => T | undefined;
}

/**
 * @public
 */
export declare interface EntityState<T> {
    ids: EntityId[];
    entities: Dictionary<T>;
}

/**
 * @public
 */
export declare interface EntityStateAdapter<T> {
    addOne<S extends EntityState<T>>(state: PreventAny<S, T>, entity: T): S;
    addOne<S extends EntityState<T>>(state: PreventAny<S, T>, action: PayloadAction<T>): S;
    addMany<S extends EntityState<T>>(state: PreventAny<S, T>, entities: T[] | Record<EntityId, T>): S;
    addMany<S extends EntityState<T>>(state: PreventAny<S, T>, entities: PayloadAction<T[] | Record<EntityId, T>>): S;
    setAll<S extends EntityState<T>>(state: PreventAny<S, T>, entities: T[] | Record<EntityId, T>): S;
    setAll<S extends EntityState<T>>(state: PreventAny<S, T>, entities: PayloadAction<T[] | Record<EntityId, T>>): S;
    removeOne<S extends EntityState<T>>(state: PreventAny<S, T>, key: EntityId): S;
    removeOne<S extends EntityState<T>>(state: PreventAny<S, T>, key: PayloadAction<EntityId>): S;
    removeMany<S extends EntityState<T>>(state: PreventAny<S, T>, keys: EntityId[]): S;
    removeMany<S extends EntityState<T>>(state: PreventAny<S, T>, keys: PayloadAction<EntityId[]>): S;
    removeAll<S extends EntityState<T>>(state: PreventAny<S, T>): S;
    updateOne<S extends EntityState<T>>(state: PreventAny<S, T>, update: Update<T>): S;
    updateOne<S extends EntityState<T>>(state: PreventAny<S, T>, update: PayloadAction<Update<T>>): S;
    updateMany<S extends EntityState<T>>(state: PreventAny<S, T>, updates: Update<T>[]): S;
    updateMany<S extends EntityState<T>>(state: PreventAny<S, T>, updates: PayloadAction<Update<T>[]>): S;
    upsertOne<S extends EntityState<T>>(state: PreventAny<S, T>, entity: T): S;
    upsertOne<S extends EntityState<T>>(state: PreventAny<S, T>, entity: PayloadAction<T>): S;
    upsertMany<S extends EntityState<T>>(state: PreventAny<S, T>, entities: T[] | Record<EntityId, T>): S;
    upsertMany<S extends EntityState<T>>(state: PreventAny<S, T>, entities: PayloadAction<T[] | Record<EntityId, T>>): S;
}

declare type FallbackIfUnknown<T, Fallback> = IsUnknown<T, Fallback, T>;

/**
 * @public
 */
export declare function findNonSerializableValue(value: unknown, path?: ReadonlyArray<string>, isSerializable?: (value: unknown) => boolean, getEntries?: (value: unknown) => [string, any][], ignoredPaths?: string[]): NonSerializableValue | false;

/**
 * Returns any array containing the default middleware installed by
 * `configureStore()`. Useful if you want to configure your store with a custom
 * `middleware` array but still keep the default set.
 *
 * @return The default middleware used by `configureStore()`.
 *
 * @public
 */
export declare function getDefaultMiddleware<S = any, O extends Partial<GetDefaultMiddlewareOptions> = {
    thunk: true;
    immutableCheck: true;
    serializableCheck: true;
}>(options?: O): MiddlewareArray<Middleware<{}, S> | ThunkMiddlewareFor<S, O>>;

declare interface GetDefaultMiddlewareOptions {
    thunk?: boolean | ThunkOptions;
    immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
    serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

declare type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
    dispatch: infer Dispatch;
} ? FallbackIfUnknown<Dispatch, ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>> : ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>;

declare type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
    extra: infer Extra;
} ? Extra : unknown;

declare type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
    rejectValue: infer RejectValue;
} ? RejectValue : unknown;

declare type GetState<ThunkApiConfig> = ThunkApiConfig extends {
    state: infer State;
} ? State : unknown;

declare type GetThunkAPI<ThunkApiConfig> = BaseThunkAPI<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, GetDispatch<ThunkApiConfig>, GetRejectValue<ThunkApiConfig>>;

/**
 * Returns the action type of the actions created by the passed
 * `createAction()`-generated action creator (arbitrary action creators
 * are not supported).
 *
 * @param action The action creator whose action type to get.
 * @returns The action type used by the action creator.
 *
 * @public
 */
export declare function getType<T extends string>(actionCreator: PayloadActionCreator<any, T>): T;

/**
 * @public
 */
export declare type IdSelector<T> = (model: T) => EntityId;

/**
 * @internal
 */
declare type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False;

declare type IfPrepareActionMethodProvided<PA extends PrepareAction<any> | void, True, False> = PA extends (...args: any[]) => any ? True : False;

/**
 * @internal
 */
declare type IfVoid<P, True, False> = [void] extends [P] ? True : False;

/**
 * Options for `createImmutableStateInvariantMiddleware()`.
 *
 * @public
 */
export declare interface ImmutableStateInvariantMiddlewareOptions {
    /**
      Callback function to check if a value is considered to be immutable.
      This function is applied recursively to every value contained in the state.
      The default implementation will return true for primitive types
      (like numbers, strings, booleans, null and undefined).
     */
    isImmutable?: IsImmutableFunc;
    /**
      An array of dot-separated path strings that match named nodes from
      the root state to ignore when checking for immutability.
      Defaults to undefined
     */
    ignoredPaths?: string[];
    /** Print a warning if checks take longer than N ms. Default: 32ms */
    warnAfter?: number;
    ignore?: string[];
}

/**
 * return True if T is `any`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
declare type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false) ? True : False;

/**
 * @internal
 */
declare type IsEmptyObj<T, True, False = never> = T extends any ? keyof T extends never ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>> : False : never;

/**
 * The default `isImmutable` function.
 *
 * @public
 */
export declare function isImmutableDefault(value: unknown): boolean;

declare type IsImmutableFunc = (value: any) => boolean;

/**
 * Returns true if the passed value is "plain", i.e. a value that is either
 * directly JSON-serializable (boolean, number, string, array, plain object)
 * or `undefined`.
 *
 * @param val The value to check.
 *
 * @public
 */
export declare function isPlain(val: any): boolean;

/**
 * return True if T is `unknown`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
declare type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;

/**
 * @internal
 */
declare type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<IsUnknown<T, True, False>, IsEmptyObj<T, True, IsUnknown<T, True, False>>>;

/**
 * @public
 */
export declare class MiddlewareArray<Middlewares extends Middleware<any, any>> extends Array<Middlewares> {
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<Middlewares | AdditionalMiddlewares[number]>;
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<Middlewares | AdditionalMiddlewares[number]>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<AdditionalMiddlewares[number] | Middlewares>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<AdditionalMiddlewares[number] | Middlewares>;
}

declare type Middlewares<S> = ReadonlyArray<Middleware<{}, S>>;

/**
 *
 * @public
 */
export declare let nanoid: (size?: number) => string;

/**
 * Helper type. Passes T out again, but boxes it in a way that it cannot
 * "widen" the type by accident if it is a generic that should be inferred
 * from elsewhere.
 *
 * @internal
 */
declare type NoInfer<T> = [T][T extends any ? 0 : never];

declare interface NonSerializableValue {
    keyPath: string;
    value: unknown;
}

declare type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export { OutputParametricSelector }
export { OutputSelector }
export { ParametricSelector }

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
export declare type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
    payload: P;
    type: T;
} & ([M] extends [never] ? {} : {
    meta: M;
}) & ([E] extends [never] ? {} : {
    error: E;
});

/**
 * An action creator that produces actions with a `payload` attribute.
 *
 * @typeParam P the `payload` type
 * @typeParam T the `type` of the resulting action
 * @typeParam PA if the resulting action is preprocessed by a `prepare` method, the signature of said method.
 *
 * @public
 */
export declare type PayloadActionCreator<P = void, T extends string = string, PA extends PrepareAction<P> | void = void> = IfPrepareActionMethodProvided<PA, _ActionCreatorWithPreparedPayload<PA, T>, IsAny<P, ActionCreatorWithPayload<any, T>, IsUnknownOrNonInferrable<P, ActionCreatorWithNonInferrablePayload<T>, IfVoid<P, ActionCreatorWithoutPayload<T>, IfMaybeUndefined<P, ActionCreatorWithOptionalPayload<P, T>, ActionCreatorWithPayload<P, T>>>>>>;

declare type PayloadForActionTypesExcludingErrorActions<T> = T extends {
    error: any;
} ? never : T extends {
    payload: infer P;
} ? P : never;

/**
 * A "prepare" method to be used as the second parameter of `createAction`.
 * Takes any number of arguments and returns a Flux Standard Action without
 * type (will be added later) that *must* contain a payload (might be undefined).
 *
 * @public
 */
export declare type PrepareAction<P> = ((...args: any[]) => {
    payload: P;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
}) | ((...args: any[]) => {
    payload: P;
    error: any;
}) | ((...args: any[]) => {
    payload: P;
    meta: any;
    error: any;
});

declare type PreventAny<S, T> = IsAny<S, EntityState<T>, S>;

declare class RejectWithValue<RejectValue> {
    readonly value: RejectValue;
    constructor(value: RejectValue);
}
export { Selector }

/**
 * Options for `createSerializableStateInvariantMiddleware()`.
 *
 * @public
 */
export declare interface SerializableStateInvariantMiddlewareOptions {
    /**
     * The function to check if a value is considered serializable. This
     * function is applied recursively to every value contained in the
     * state. Defaults to `isPlain()`.
     */
    isSerializable?: (value: any) => boolean;
    /**
     * The function that will be used to retrieve entries from each
     * value.  If unspecified, `Object.entries` will be used. Defaults
     * to `undefined`.
     */
    getEntries?: (value: any) => [string, any][];
    /**
     * An array of action types to ignore when checking for serializability.
     * Defaults to []
     */
    ignoredActions?: string[];
    /**
     * An array of dot-separated path strings to ignore when checking
     * for serializability, Defaults to ['meta.arg']
     */
    ignoredActionPaths?: string[];
    /**
     * An array of dot-separated path strings to ignore when checking
     * for serializability, Defaults to []
     */
    ignoredPaths?: string[];
    /**
     * Execution time warning threshold. If the middleware takes longer
     * than `warnAfter` ms, a warning will be displayed in the console.
     * Defaults to 32ms.
     */
    warnAfter?: number;
}

/**
 * @public
 */
export declare interface SerializedError {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
}

/**
 * The return value of `createSlice`
 *
 * @public
 */
export declare interface Slice<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string> {
    /**
     * The slice name.
     */
    name: Name;
    /**
     * The slice's reducer.
     */
    reducer: Reducer<State>;
    /**
     * Action creators for the types of actions that are handled by the slice
     * reducer.
     */
    actions: CaseReducerActions<CaseReducers>;
    /**
     * The individual case reducer functions that were passed in the `reducers` parameter.
     * This enables reuse and testing if they were defined inline when calling `createSlice`.
     */
    caseReducers: SliceDefinedCaseReducers<CaseReducers>;
}

/**
 * An action creator attached to a slice.
 *
 * @deprecated please use PayloadActionCreator directly
 *
 * @public
 */
export declare type SliceActionCreator<P> = PayloadActionCreator<P>;

/**
 * The type describing a slice's `reducers` option.
 *
 * @public
 */
export declare type SliceCaseReducers<State> = {
    [K: string]: CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;
};

/**
 * Extracts the CaseReducers out of a `reducers` object, even if they are
 * tested into a `CaseReducerWithPrepare`.
 *
 * @internal
 */
declare type SliceDefinedCaseReducers<CaseReducers extends SliceCaseReducers<any>> = {
    [Type in keyof CaseReducers]: CaseReducers[Type] extends {
        reducer: infer Reducer;
    } ? Reducer : CaseReducers[Type];
};
export { ThunkAction }
export { ThunkDispatch }

declare type ThunkMiddlewareFor<S, O extends GetDefaultMiddlewareOptions = {}> = O extends {
    thunk: false;
} ? never : O extends {
    thunk: {
        extraArgument: infer E;
    };
} ? ThunkMiddleware<S, AnyAction, E> : ThunkMiddleware<S, AnyAction, null> | ThunkMiddleware<S, AnyAction>;

declare interface ThunkOptions<E = any> {
    extraArgument: E;
}

declare interface TypedActionCreator<Type extends string> {
    (...args: any[]): Action<Type>;
    type: Type;
}

/**
 * Convert a Union type `(A|B)` to and intersecion type `(A&B)`
 */
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * @public
 */
export declare function unwrapResult<R extends ActionTypesWithOptionalErrorAction>(returned: R): PayloadForActionTypesExcludingErrorActions<R>;

/**
 * @public
 */
export declare type Update<T> = {
    id: EntityId;
    changes: Partial<T>;
};

/**
 * Used on a SliceCaseReducers object.
 * Ensures that if a CaseReducer is a `CaseReducerWithPrepare`, that
 * the `reducer` and the `prepare` function use the same type of `payload`.
 *
 * Might do additional such checks in the future.
 *
 * This type is only ever useful if you want to write your own wrapper around
 * `createSlice`. Please don't use it otherwise!
 *
 * @public
 */
export declare type ValidateSliceCaseReducers<S, ACR extends SliceCaseReducers<S>> = ACR & {
    [T in keyof ACR]: ACR[T] extends {
        reducer(s: S, action?: infer A): any;
    } ? {
        prepare(...a: never[]): Omit<A, 'type'>;
    } : {};
};

declare type WithStrictNullChecks<True, False> = undefined extends boolean ? False : True;

export * from "redux";

export { }
