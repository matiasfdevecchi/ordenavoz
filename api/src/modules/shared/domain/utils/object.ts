export const removeUndefined = (obj: any) => {
    const newObj = {} as any;
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}