import { FC } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";

type Props = {
    onClose: () => void;
}

const Header: FC<Props> = ({ onClose }) => {

    return (
        <div className='modal-header justify-content-between'>
            {/* begin::Modal title */}
            <h2 className='fw-bolder'>Crear categoría</h2>
            {/* end::Modal title */}

            {/* begin::Close */}
            <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                onClick={onClose}
                style={{ cursor: 'pointer' }}
            >
                <KTIcon iconName='cross' className='fs-1' />
            </div>
            {/* end::Close */}
        </div>
    )
}

export default Header;
