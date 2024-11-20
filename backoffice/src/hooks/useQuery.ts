import { useQuery as useQueryLib, UseQueryOptions, UseQueryResult, QueryKey } from 'react-query';
import useHttpErrorNotifier from './useHttpErrorNotifier';

const useQuery = <TData = unknown, TError = unknown>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options?: UseQueryOptions<TData, TError>
): UseQueryResult<TData, TError> => {
    const notifyError = useHttpErrorNotifier();

    return useQueryLib(queryKey, queryFn, {
        ...options,
        onError: (error) => {
            notifyError(error);
            if (options?.onError) {
                options.onError(error);
            }
        },
    });
};

export default useQuery;
