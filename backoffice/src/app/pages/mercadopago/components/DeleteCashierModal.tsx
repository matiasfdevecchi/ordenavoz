import { FC } from "react";
import { Cashier } from "../../../../api/mercadopago/cashiers/Cashier";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: Cashier) => void;
    cashier: Cashier;
    loading: boolean;
}

const DeleteCashierModal: FC<Props> = ({ onClose, onDelete, cashier, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar caja "${cashier.name}"`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar esta caja? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(cashier)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteCashierModal;