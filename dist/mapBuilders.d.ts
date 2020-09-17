import { Action, AnyAction } from 'redux';
import { CaseReducer, CaseReducers, ActionMatcher, ActionMatcherDescriptionCollection } from './createReducer';
export interface TypedActionCreator<Type extends string> {
    (...args: any[]): Action<Type>;
    type: Type;
}
/**
 * A builder for an action <-> reducer map.
 *
 * @public
 */
export interface ActionReducerMapBuilder<State> {
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
export declare function executeReducerBuilderCallback<S>(builderCallback: (builder: ActionReducerMapBuilder<S>) => void): [CaseReducers<S, any>, ActionMatcherDescriptionCollection<S>, CaseReducer<S, AnyAction> | undefined];
