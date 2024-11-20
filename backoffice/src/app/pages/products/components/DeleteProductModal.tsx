import { FC } from "react";
import { Product } from "../../../../api/products/Product";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: Product) => void;
    product: Product;
    loading: boolean;
}

const DeleteProductModal: FC<Props> = ({ onClose, onDelete, product, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar "${product.name}"`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar este producto? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(product)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteProductModal;