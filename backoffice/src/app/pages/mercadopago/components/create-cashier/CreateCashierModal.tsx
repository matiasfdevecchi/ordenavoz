import { FC, useMemo } from 'react'
import * as Yup from 'yup'
import CustomModal from '../../../../../components/CustomModal';
import { useNotifier } from '../../../../../hooks/useNotifier';
import { useFormik } from 'formik';
import { KTIcon } from '../../../../../_metronic/helpers';
import clsx from 'clsx';
import { Store } from '../../../../../api/mercadopago/stores/Store';
import { useGetMercadoPagoCashiers } from '../../../../../api/mercadopago/services/cashiers';
import { useCreateCashier } from '../../../../../api/mercadopago/cashiers';

type Props = {
    store: Store;
    onClose: () => void;
}

const CreateCashierModal: FC<Props> = ({ store, onClose }) => {
    const { notifySuccess } = useNotifier();

    const { data: cashiers, isLoading } = useGetMercadoPagoCashiers(store.id);

    const createCashierAction = useCreateCashier();
    const { isLoading: isLoadingCreate } = createCashierAction;

    const nonSelectedCashiers = useMemo(() => {
        if (cashiers !== undefined) {
            if (!store.cashiers || store.cashiers.length === 0) {
                return cashiers;
            } else {
                return cashiers.filter(cashier => !store.cashiers!!.find(c => c.id === cashier.id));
            }
        }
        return undefined;
    }, [cashiers]);

    const formik = useFormik({
        initialValues: {
            cashier: '',
            externalId: '',
        },
        validationSchema: Yup.object().shape({
            cashier: Yup.string().required('Seleccionar una caja es obligatorio'),
            externalId: Yup.string().required('El identificador del negocio es obligatorio'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createCashierAction.mutateAsync({
                storeId: store.id,
                cashierId: Number(values.cashier),
                externalId: values.externalId,
            });
            notifySuccess('Caja conectada con éxito');
            setSubmitting(false);
            onClose();
        },
    });

    return <CustomModal
        title={`Conectar caja`}
        onClose={onClose}
        className='modal-lg'
    >
        <div className='w-100' data-kt-stepper-element='content'>
            <form id='kt_modal_add_user_form' className='form w-100' onSubmit={formik.handleSubmit} noValidate>
                <div className='mb-0 fv-row'>
                    <div className='pb-10 pb-lg-10'>
                        <h2 className='fw-bolder text-gray-900'>Seleccionar caja</h2>
                        <div className='text-gray-500 fw-bold fs-6'>
                            Seleccione la caja e ingresa un identificador para identificarlo en este sistema.
                        </div>
                    </div>
                    <label className='d-flex align-items-center form-label mb-5'>
                        Cajas disponibles
                        <i
                            className='fas fa-exclamation-circle ms-2 fs-7'
                            data-bs-toggle='tooltip'
                            title='Cajas encontradas en tu negocio de Mercado Pago'
                        ></i>
                    </label>

                    <div className='mb-0'>
                        {
                            isLoading && <div className="text-center">
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </div>
                        }
                        {
                            nonSelectedCashiers && nonSelectedCashiers.map((cashier) => (
                                <label key={cashier.id} className='d-flex flex-stack mb-5 cursor-pointer'>
                                    <span className='d-flex align-items-center me-2'>
                                        <span className='symbol symbol-50px me-6'>
                                            <span className='symbol-label'>
                                                <KTIcon iconName='bank' className='fs-1 text-gray-600' />
                                            </span>
                                        </span>

                                        <span className='d-flex flex-column'>
                                            <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                                                {cashier.name}
                                            </span>
                                            <span className='fs-6 fw-bold text-gray-500'>
                                                {cashier.id}
                                            </span>
                                        </span>
                                    </span>

                                    <span className='form-check form-check-custom form-check-solid'>
                                        <input
                                            type='radio'
                                            name='cashier'
                                            value={cashier.id}
                                            className={clsx(
                                                'form-check-input',
                                                { 'is-invalid': formik.touched.cashier && formik.errors.cashier }
                                            )}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            checked={formik.values.cashier === cashier.id.toString()}
                                        />
                                    </span>
                                </label>
                            ))
                        }
                        {formik.touched.cashier && formik.errors.cashier && (
                            <div className='text-danger mt-2'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.cashier}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {
                        nonSelectedCashiers && nonSelectedCashiers.length === 0 && <div className='text-center'>
                            <p className='text-gray-500 fs-4 fw-semibold py-7'>
                                No hay cajas disponibles para conectar.
                            </p>
                        </div>
                    }

                    {
                        nonSelectedCashiers && nonSelectedCashiers.length > 0 && <div className='my-10 fv-row'>
                            <label className='form-label mb-3'>Identificador del negocio</label>

                            <input
                                type='text'
                                className={clsx(
                                    'form-control form-control-lg form-control-solid',
                                    { 'is-invalid': formik.touched.externalId && formik.errors.externalId }
                                )}
                                name='externalId'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.externalId}
                                autoComplete='off'
                            />
                            {formik.touched.externalId && formik.errors.externalId && (
                                <div className='text-danger mt-2'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.externalId}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    }

                    <div className='d-flex flex-stack pt-10 justify-content-end'>
                        <div className='me-2'>
                            <button
                                type='button'
                                className='btn btn-lg btn-light-primary me-3'
                                data-kt-stepper-action='previous'
                                onClick={onClose}
                            >
                                <KTIcon iconName='arrow-left' className='fs-3 me-1' /> Volver
                            </button>
                        </div>
                        <div>
                            <button
                                type='submit'
                                className='btn btn-lg btn-primary'
                                data-kt-stepper-action='submit'
                                disabled={formik.isSubmitting || !formik.isValid || !formik.touched || !formik.dirty}
                            >
                                Conectar
                                {
                                    (!formik.isSubmitting && !isLoadingCreate) && <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
                                }
                                {
                                    (formik.isSubmitting || isLoadingCreate) && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </CustomModal>
}

export default CreateCashierModal;
