
import { DEFAULT_TIMEOUT, useNotifier } from './hooks/useNotifier'
import { SnackbarProvider } from 'notistack'
import { AppRoutes } from './app/routing/AppRoutes'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
// Apps
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
import useHttpErrorNotifier from './hooks/useHttpErrorNotifier'

const App = () => {
    const notifyError = useHttpErrorNotifier();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                onError: (error) => {
                    notifyError(error);
                },
            },
            mutations: {
                onError: (error) => {
                    notifyError(error);
                },
            },
        },
    });


    return <QueryClientProvider client={queryClient}>
        <MetronicI18nProvider>
            <SnackbarProvider
                maxSnack={1}
                autoHideDuration={DEFAULT_TIMEOUT}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <AppRoutes />
            </SnackbarProvider>
        </MetronicI18nProvider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>;
}

export default App;