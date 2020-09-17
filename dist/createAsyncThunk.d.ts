import { Dispatch, AnyAction } from 'redux';
import { PayloadAction, ActionCreatorWithPreparedPayload } from './createAction';
import { ThunkDispatch } from 'redux-thunk';
import { FallbackIfUnknown, IsAny } from './tsHelpers';
export declare type BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined> = {
    dispatch: D;
    getState: () => S;
    extra: E;
    requestId: string;
    signal: AbortSignal;
    rejectWithValue(value: RejectedValue): RejectWithValue<RejectedValue>;
};
/**
 * @public
 */
export interface SerializedError {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
}
declare class RejectWithValue<RejectValue> {
    readonly value: RejectValue;
    constructor(value: RejectValue);
}
export declare const miniSerializeError: (value: any) => SerializedError;
declare type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: Dispatch;
    extra?: unknown;
    rejectValue?: unknown;
};
declare type GetState<ThunkApiConfig> = ThunkApiConfig extends {
    state: infer State;
} ? State : unknown;
declare type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
    extra: infer Extra;
} ? Extra : unknown;
declare type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
    dispatch: infer Dispatch;
} ? FallbackIfUnknown<Dispatch, ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>> : ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>;
declare type GetThunkAPI<ThunkApiConfig> = BaseThunkAPI<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, GetDispatch<ThunkApiConfig>, GetRejectValue<ThunkApiConfig>>;
declare type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
    rejectValue: infer RejectValue;
} ? RejectValue : unknown;
/**
 * A type describing the return value of the `payloadCreator` argument to `createAsyncThunk`.
 * Might be useful for wrapping `createAsyncThunk` in custom abstractions.
 *
 * @public
 */
export declare type AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig extends AsyncThunkConfig> = Promise<Returned | RejectWithValue<GetRejectValue<ThunkApiConfig>>> | Returned | RejectWithValue<GetRejectValue<ThunkApiConfig>>;
/**
 * A type describing the `payloadCreator` argument to `createAsyncThunk`.
 * Might be useful for wrapping `createAsyncThunk` in custom abstractions.
 *
 * @public
 */
export declare type AsyncThunkPayloadCreator<Returned, ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}> = (arg: ThunkArg, thunkAPI: GetThunkAPI<ThunkApiConfig>) => AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig>;
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
interface AsyncThunkOptions<ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}> {
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
declare type AsyncThunkFulfilledActionCreator<Returned, ThunkArg> = ActionCreatorWithPreparedPayload<[Returned, string, ThunkArg], Returned, string, never, {
    arg: ThunkArg;
    requestId: string;
}>;
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
 *
 * @param typePrefix
 * @param payloadCreator
 * @param options
 *
 * @public
 */
export declare function createAsyncThunk<Returned, ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>, options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
declare type ActionTypesWithOptionalErrorAction = {
    error: any;
} | {
    error?: never;
    payload: any;
};
declare type PayloadForActionTypesExcludingErrorActions<T> = T extends {
    error: any;
} ? never : T extends {
    payload: infer P;
} ? P : never;
/**
 * @public
 */
export declare function unwrapResult<R extends ActionTypesWithOptionalErrorAction>(returned: R): PayloadForActionTypesExcludingErrorActions<R>;
declare type WithStrictNullChecks<True, False> = undefined extends boolean ? False : True;
export {};
