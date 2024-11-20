import { FC } from "react";
import { Order } from "../../../../api/orders/Order";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onCancel: (c: Order) => void;
    order: Order;
    loading: boolean;
}

const CancelOrderModal: FC<Props> = ({ onClose, onCancel, order, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Cancelar orden #${order.id}`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas cancelar esta orden? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Volver
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onCancel(order)}>
                Continuar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default CancelOrderModal;