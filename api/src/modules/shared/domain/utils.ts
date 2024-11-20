export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// function for check if a value of object is undefined
export const validateNotUndefined = <T>(object: Object, excludeFields: string[] = []) => {
    const keys = Object.keys(object);
    const undefinedKeys = keys.filter((key) => object[key as keyof typeof object] === undefined && !excludeFields.includes(key));
    if (undefinedKeys.length > 0)
        throw new Error(`The following keys are undefined: ${undefinedKeys.join(', ')}`);
    
    return object as T
}