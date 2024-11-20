import { FC } from "react";
import { Ingredient } from "../../../../api/ingredients/Ingredient";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: Ingredient) => void;
    ingredient: Ingredient;
    loading: boolean;
}

const DeleteIngredientModal: FC<Props> = ({ onClose, onDelete, ingredient, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar "${ingredient.name}"`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar este ingrediente? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(ingredient)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteIngredientModal;