import { OrderStatus } from "../api/orders/Order";

export const getStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PAYMENT_PENDING:
            return 'Pendiente de pago';
        case OrderStatus.PREPARING:
            return 'Preparando';
        case OrderStatus.READY:
            return 'Listo para entregar';
        case OrderStatus.COMPLETED:
            return 'Completado';
        case OrderStatus.CANCELED:
            return 'Cancelado';
    }
}

export const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PAYMENT_PENDING:
            return 'warning';
        case OrderStatus.PREPARING:
            return 'primary';
        case OrderStatus.READY:
            return 'info';
        case OrderStatus.COMPLETED:
            return 'success';
        case OrderStatus.CANCELED:
            return 'danger';
    }
}