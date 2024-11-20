import { useMutation as useMutationLib, UseMutationOptions, UseMutationResult, MutationFunction } from 'react-query';
import useHttpErrorNotifier from './useHttpErrorNotifier';

const useMutation = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> => {
    const notifyError = useHttpErrorNotifier();

    return useMutationLib(mutationFn, {
        ...options,
        onError: (error, variables, context) => {
            notifyError(error);
            if (options?.onError) {
                options.onError(error, variables, context);
            }
        },
    });
};

export default useMutation;
