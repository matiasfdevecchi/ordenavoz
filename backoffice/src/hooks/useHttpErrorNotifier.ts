import { ErrorType, HandledError } from "../api/utils/HandledError";
import { assertNever } from "../utils/types";
import { useNotifier } from "./useNotifier"

const parseError = (error: any): string => {
    const handledError = error as HandledError | undefined;

    if (!handledError) return "Ha ocurrido un error inesperado";

    const data = handledError.getMessage();

    console.log(data);

    switch (data.type) {
        case ErrorType.ACCESS_DENIED:
            return "Acceso denegado";

        case ErrorType.BAD_REQUEST:
            return "Datos incorrectos";

        case ErrorType.FORM_INVALID_FIELD:
            return "Usuario o contraseña incorrecta";

        case ErrorType.INVALID_STATE:
            return "Estado inválido";

        case ErrorType.INSUFICIENT_STOCK:
            return "Stock insuficiente de alguno/s de los productos";

        case ErrorType.RESOURCE_ALREADY_EXISTS:
            switch (data.params?.resource) {
                default:
                    return "El recurso ya existe";
            }

        case ErrorType.INVALID_ENUM_VALUE:
            return "Valor inválido para el enum";

        case ErrorType.USER_AND_TOKEN_MISMATCH:
            return "Usuario y token no coinciden";

        case ErrorType.UNAUTHORIZED:
            return "Usuario no autorizado";

        case ErrorType.UNKNOWN:
            return "Ha ocurrido un error inesperado";

        case ErrorType.RESOURCES_NOT_FOUND:
            return "No se encontraron los recursos";

        case ErrorType.RESOURCE_NOT_FOUND:
            return "No se encontró el recurso";

        case ErrorType.PASSWORD_TO_WEAK:
            return "La contraseña es demasiado débil";

        case ErrorType.PREVIOUS_PASSWORD_IS_INVALID:
            return "La contraseña actual es incorrecta";

        case ErrorType.INSUFICIENT_PERMISSIONS:
            return "Permisos insuficientes";

        case ErrorType.CANT_DELETE_YOURSELF:
            return "No puedes eliminarte a ti mismo";

        case ErrorType.CATEGORY_IS_NOT_CHILD:
            return "La categoría no es hija";

        case ErrorType.INVALID_MOVEMENT_AMOUNT:
            return "Monto de movimiento inválido";

        case ErrorType.TRANSFER_RECEIPT_REQUIRED:
            return "Se requiere comprobante de transferencia";

        case ErrorType.MERCADO_PAGO_ACCOUNT_REQUIRED:
            return "Se requiere una cuenta de Mercado Pago para la tienda online";

        case ErrorType.MERCADO_PAGO_ACCOUNT_ALREADY_ASSIGNED:
            return "La cuenta de Mercado Pago ya está asignada";

        case ErrorType.MERCADO_PAGO_ACCOUNT_CANT_BE_DELETED:
            return "No se puede eliminar la cuenta de Mercado Pago";

        case ErrorType.MERCADO_PAGO_ACCOUNT_CANT_BE_UNASSIGNED:
            return "No se puede desasignar la cuenta de Mercado Pago";

        case ErrorType.INCOMPATIBLE_CURRENCY:
            return "Moneda incompatible";

        case ErrorType.CASH_SALE_CANT_BE_DELIVERED:
            return "No se puede entregar la venta en efectivo";

        case ErrorType.CATEGORY_LINKED_TO_PRODUCTS:
            return "La categoría está vinculada a productos";

        case ErrorType.INGREDIENT_LINKED_TO_PRODUCTS:
            return "El ingrediente está vinculado a productos";

        case ErrorType.MERCADO_PAGO_CASHIER_NOT_FOUND:
            return "No se encontró la caja de Mercado Pago";

        case ErrorType.MERCADO_PAGO_STORE_NOT_FOUND:
            return "No se encontró el local de Mercado Pago";

        case ErrorType.MERCADO_PAGO_FORBIDDEN:
            return "Acceso denegado a Mercado Pago";

        case ErrorType.MERCADO_PAGO_CONFLICT:
            return "El identificador ya está en uso";

        case ErrorType.STORE_LINKED_TO_CASHIERS:
            return "El local está vinculado a cajas";

        case ErrorType.MERCADO_PAGO_DEVICE_FORBIDDEN:
            return "Acceso denegado al dispositivo de Mercado Pago";

        case ErrorType.MERCADO_PAGO_INTENT_NOT_FOUND:
            return "No se encontró la intención de pago";

        case ErrorType.MERCADO_PAGO_INTENT_ALREADY_PROCESSED:
            return "La intención de pago ya fue procesada. Cancélala desde el dispositivo";

        case ErrorType.MERCADO_PAGO_INTENT_ALREADY_QUEUED:
            return "Ya hay una intención de pago en cola. Ábrela desde el dispositivo";

        case ErrorType.MERCADO_PAGO_INVALID_AMOUNT:
            return "Monto inválido";

        default:
            return assertNever(data.type);
    }
};

const useHttpErrorNotifier = () => {
    const { notifyError } = useNotifier();

    const notifyHttpError = (error: any) => {
        const message = parseError(error);
        notifyError(message);
    };

    return notifyHttpError;
}

export default useHttpErrorNotifier;