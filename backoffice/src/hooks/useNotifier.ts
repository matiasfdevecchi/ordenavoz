import { MaterialDesignContent, SnackbarAction, useSnackbar, VariantType } from "notistack";
import { useCallback } from "react";

type ComponentsType = {
    default?: React.JSXElementConstructor<any> | undefined;
    error?: React.JSXElementConstructor<any> | undefined;
    success?: React.JSXElementConstructor<any> | undefined;
    warning?: React.JSXElementConstructor<any> | undefined;
    info?: React.JSXElementConstructor<any> | undefined;
} | undefined;

export const DEFAULT_TIMEOUT = 3000;
export const EXTEND_TIMEOUT = 5000;

export const useNotifier = () => {
    const { enqueueSnackbar } = useSnackbar();

    const notify = useCallback((message: string, type: VariantType, autoHideDuration: number | undefined = undefined, action: SnackbarAction | undefined = undefined) => {
        enqueueSnackbar(message, { variant: type, autoHideDuration, action });
    }, [enqueueSnackbar]);

    const notifySuccess = useCallback((message: string, autoHideDuration: number | undefined = undefined, action: SnackbarAction | undefined = undefined) => {
        notify(message, "success", autoHideDuration, action);
    }, [notify]);

    const notifyError = useCallback((message: string, autoHideDuration: number | undefined = undefined, action: SnackbarAction | undefined = undefined) => {
        notify(message, "error", autoHideDuration, action);
    }, [notify]);

    return {
        notifySuccess,
        notifyError,
    }
};