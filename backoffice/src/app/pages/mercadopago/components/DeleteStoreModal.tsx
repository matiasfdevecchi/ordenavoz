import { FC } from "react";
import { Store } from "../../../../api/mercadopago/stores/Store";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: Store) => void;
    store: Store;
    loading: boolean;
}

const DeleteStoreModal: FC<Props> = ({ onClose, onDelete, store, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar sucursal`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar esta sucursal? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(store)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteStoreModal;