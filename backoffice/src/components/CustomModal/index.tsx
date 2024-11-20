import { FC, useEffect, useState } from "react";
import { KTSVG } from "../../_metronic/helpers";

type Props = {
    title: string;
    children: React.ReactNode;
    className?: string;
    onClose: () => void;
}

const CustomModal: FC<Props> = ({ title, onClose, children, className = '' }) => {
    const [mouseDownOutside, setMouseDownOutside] = useState(false);

    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setMouseDownOutside(true);
        } else {
            setMouseDownOutside(false);
        }
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mouseDownOutside && e.target === e.currentTarget) {
            onClose();
        }
        setMouseDownOutside(false);
    }

    return (
        <>
            <div
                className={`modal fade show d-block ${className}`}
                role='dialog'
                tabIndex={-1}
                aria-modal='true'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header justify-content-between">
                            <h5 className="modal-title">{title}</h5>
                            <div
                                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <KTSVG
                                    path="media/icons/duotune/arrows/arr061.svg"
                                    className="svg-icon svg-icon-2x"
                                />
                            </div>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal-backdrop fade show' />
        </>
    )
}

export default CustomModal;
