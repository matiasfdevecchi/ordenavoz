import { FC, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import CustomModal from '../../../../../components/CustomModal';
import { StepperComponent } from '../../../../../_metronic/assets/ts/components';
import Step1 from './Step1';
import Step2 from './Step2';
import { Store } from '../../../../../api/mercadopago/stores/Store';
import { useCreateStore } from '../../../../../api/mercadopago/stores';
import { useNotifier } from '../../../../../hooks/useNotifier';

type Props = {
    onClose: () => void;
}

const CreateStoreModal: FC<Props> = ({ onClose }) => {
    const { notifySuccess } = useNotifier();
    const stepperRef = useRef<HTMLDivElement | null>(null)
    const [stepper, setStepper] = useState<StepperComponent | null>(null)

    const [stores, setStores] = useState<Store[]>([]);

    const createStoreAction = useCreateStore();

    const loadStepper = () => {
        setStepper(StepperComponent.createInsance(stepperRef.current as HTMLDivElement))
    }

    useEffect(() => {
        loadStepper()
    }, []);

    const prevStep = () => {
        if (!stepper) {
            return
        }

        if (stepper.currentStepIndex === 2) {
            setSelectedUserId(undefined);
        }

        stepper.goPrev()
    }

    const nextStep = () => {
        if (!stepper) {
            return
        }

        if (stepper.currentStepIndex === 1) {

        }

        stepper.goNext()
    }

    const handleStep1Next = (stores: Store[]) => {
        setStores(stores);
        nextStep();
    }

    const submit = async (values: { store: string, externalId: string }) => {
        await createStoreAction.mutateAsync({
            mpUserId: selectedUserId as number,
            storeId: values.store,
            externalId: values.externalId
        });
        notifySuccess("Local conectado correctamente");
        onClose();
    }

    const [selectedUserId, setSelectedUserId] = useState<number>();

    return <CustomModal
        title={`Conectar local`}
        onClose={onClose}
        className='modal-lg'
    >
        {/*begin::Stepper */}
        <div
            ref={stepperRef}
            className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
            id='kt_modal_create_app_stepper'
        >
            {/* begin::Aside*/}
            <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px'>
                {/* begin::Nav*/}
                <div className='stepper-nav ps-lg-10'>
                    {/* begin::Step 1*/}
                    <div className='stepper-item current' data-kt-stepper-element='nav'>
                        {/* begin::Wrapper*/}
                        <div className='stepper-wrapper'>
                            {/* begin::Icon*/}
                            <div className='stepper-icon w-40px h-40px'>
                                <i className='stepper-check fas fa-check'></i>
                                <span className='stepper-number'>1</span>
                            </div>
                            {/* end::Icon*/}

                            {/* begin::Label*/}
                            <div className='stepper-label'>
                                <h3 className='stepper-title'>Conectar cuenta</h3>

                                <div className='stepper-desc'>Ingresa el ID de tu cuenta</div>
                            </div>
                            {/* end::Label*/}
                        </div>
                        {/* end::Wrapper*/}

                        {/* begin::Line*/}
                        <div className='stepper-line h-40px'></div>
                        {/* end::Line*/}
                    </div>
                    {/* end::Step 1*/}

                    {/* begin::Step 2*/}
                    <div className='stepper-item' data-kt-stepper-element='nav'>
                        {/* begin::Wrapper*/}
                        <div className='stepper-wrapper'>
                            {/* begin::Icon*/}
                            <div className='stepper-icon w-40px h-40px'>
                                <i className='stepper-check fas fa-check'></i>
                                <span className='stepper-number'>2</span>
                            </div>
                            {/* begin::Icon*/}

                            {/* begin::Label*/}
                            <div className='stepper-label'>
                                <h3 className='stepper-title'>Seleccionar local</h3>

                                <div className='stepper-desc'>Selecciona el local de tu negocio</div>
                            </div>
                            {/* begin::Label*/}
                        </div>
                        {/* end::Wrapper*/}

                        {/* begin::Line*/}
                        <div className='stepper-line h-40px'></div>
                        {/* end::Line*/}
                    </div>
                    {/* end::Step 2*/}
                </div>
                {/* end::Nav*/}
            </div>
            {/* begin::Aside*/}

            {/*begin::Content */}
            <div className='flex-row-fluid py-lg-5 px-lg-15'>
                <Step1 nextStep={handleStep1Next} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />
                <Step2 stores={stores} prevStep={prevStep} handleSubmit={submit} isLoading={createStoreAction.isLoading} />

                {/*begin::Actions */}
                {/* <div className='d-flex flex-stack pt-10'>
                        <div className='me-2'>
                            <button
                                type='button'
                                className='btn btn-lg btn-light-primary me-3'
                                data-kt-stepper-action='previous'
                                onClick={prevStep}
                            >
                                <KTIcon iconName='arrow-left' className='fs-3 me-1' /> Atrás
                            </button>
                        </div>
                        <div>
                            <button
                                type='button'
                                className='btn btn-lg btn-primary'
                                data-kt-stepper-action='submit'
                                onClick={submit}
                            >
                                Crear <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
                            </button>

                            <button
                                type='button'
                                className='btn btn-lg btn-primary'
                                data-kt-stepper-action='next'
                                onClick={nextStep}
                            >
                                Continuar <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
                            </button>
                        </div>
                    </div> */}
                {/*end::Actions */}
            </div>
            {/*end::Content */}
        </div>
        {/* end::Stepper */}
    </CustomModal>
}

export default CreateStoreModal;
