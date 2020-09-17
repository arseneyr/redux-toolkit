import { Middleware } from 'redux';
export declare function getTimeMeasureUtils(maxDelay: number, fnName: string): {
    measureTime<T>(fn: () => T): T;
    warnIfExceeded(): void;
};
/**
 * @public
 */
export declare class MiddlewareArray<Middlewares extends Middleware<any, any>> extends Array<Middlewares> {
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<Middlewares | AdditionalMiddlewares[number]>;
    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<Middlewares | AdditionalMiddlewares[number]>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(items: AdditionalMiddlewares): MiddlewareArray<AdditionalMiddlewares[number] | Middlewares>;
    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(...items: AdditionalMiddlewares): MiddlewareArray<AdditionalMiddlewares[number] | Middlewares>;
}
