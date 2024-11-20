import { FC } from "react";
import { Category } from "../../../../api/categories/Category";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: Category) => void;
    category: Category;
    loading: boolean;
}

const DeleteCategoryModal: FC<Props> = ({ onClose, onDelete, category, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar "${category.name}"`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar esta categoría? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(category)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteCategoryModal;