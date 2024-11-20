import { FC } from "react";
import { User } from "../../../../api/users/User";
import CustomModal from "../../../../components/CustomModal";

type Props = {
    onClose: () => void;
    onDelete: (c: User) => void;
    user: User;
    loading: boolean;
}

const DeleteUserModal: FC<Props> = ({ onClose, onDelete, user, loading }) => {
    return <CustomModal
        onClose={onClose}
        title={`Eliminar "${user.name}"`}>
        <div className="modal-body">
            <p>¿Estás seguro que deseas eliminar este usuario? Esta acción no podrá deshacerse.</p>
        </div>
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
            >
                Cancelar
            </button>
            <button type="button" className="btn btn-danger" disabled={loading} onClick={() => onDelete(user)}>
                Eliminar
                {
                    loading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
            </button>
        </div>
    </CustomModal>
}

export default DeleteUserModal;