import { FC } from "react";

type Props = {
    title: string;
    titleComponent?: React.ReactNode;
    description?: string;
    rightComponent?: React.ReactNode;
    isLoadingRightComponent?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

const DefaultPage: FC<Props> = ({ title, titleComponent, description, rightComponent, isLoadingRightComponent = false, isLoading = false, children }) => {
    return <div className='g-5 gx-xxl-8'>
        <div className={`card`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
                <div className='card-title align-items-start'>
                    <div>
                        <h3 className='card-label fw-bold fs-1 mb-1'>{title}</h3>
                        {
                            description && <span className='text-muted mt-1 fw-semibold fs-7'>{description}</span>
                        }
                    </div>
                    {
                        titleComponent && titleComponent
                    }
                </div>
                {
                    rightComponent && isLoadingRightComponent && <div className="text-center">
                        <span className='spinner-border spinner-border-sm align-middle ms-2 m-10'></span>
                    </div>
                }
                {
                    rightComponent && !isLoadingRightComponent && <div className='card-toolbar'>
                        {rightComponent}
                    </div>
                }
            </div>
            {/* end::Header */}
            {/* begin::Body */}
            <div className='card-body py-3'>
                {
                    isLoading && <div className="text-center">
                        <span className='spinner-border spinner-border-sm align-middle ms-2 m-10'></span>
                    </div>
                }
                {!isLoading && children}
            </div>
            {/* begin::Body */}
        </div>
    </div>;
}

export default DefaultPage;