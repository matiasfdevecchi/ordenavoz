import { FC, useMemo } from 'react'
import * as Yup from 'yup'
import CustomModal from '../../../../../components/CustomModal';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useFormik } from 'formik';
import clsx from 'clsx';

type Props = {
    onClose: () => void;
    onConfirm: (values: { name: string, email: string, password: string }) => Promise<void>;
}

const editUserSchema = Yup.object().shape({
    name: Yup.string().required('Requerido'),
    email: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().required('Requerido'),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden').required('Requerido'),
})

const CreateUserModal: FC<Props> = ({ onClose, onConfirm }) => {

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: editUserSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {

                await onConfirm({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                });
                onClose()
            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(false)
            }
        },
    })

    return <CustomModal
        title='Crear usuario'
        onClose={onClose}
    >
        <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
            <div className="modal-body">
                <div
                    className='d-flex flex-column me-n7 px-6'
                    id='kt_modal_add_user_scroll'
                    data-kt-scroll='true'
                    data-kt-scroll-activate='{default: false, lg: true}'
                    data-kt-scroll-max-height='auto'
                    data-kt-scroll-dependencies='#kt_modal_add_user_header'
                    data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
                    data-kt-scroll-offset='300px'
                >
                    {/* begin::Input group */}
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className='required fw-bold fs-4 mb-2'>Nombre</label>
                        {/* end::Label */}

                        {/* begin::Input */}
                        <input
                            placeholder='Nombre'
                            {...formik.getFieldProps('name')}
                            type='text'
                            name='name'
                            className={clsx(
                                'form-control form-control-solid mb-3 mb-lg-0',
                                { 'is-invalid': formik.touched.name && formik.errors.name },
                                {
                                    'is-valid': formik.touched.name && !formik.errors.name,
                                }
                            )}
                            autoComplete='off'
                            disabled={formik.isSubmitting}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.name}</span>
                                </div>
                            </div>
                        )}
                        {/* end::Input */}
                    </div>
                    {/* end::Input group */}
                    
                    {/* begin::Input group */}
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className='required fw-bold fs-4 mb-2'>Email</label>
                        {/* end::Label */}

                        {/* begin::Input */}
                        <input
                            placeholder='Email'
                            {...formik.getFieldProps('email')}
                            type='text'
                            name='email'
                            className={clsx(
                                'form-control form-control-solid mb-3 mb-lg-0',
                                { 'is-invalid': formik.touched.email && formik.errors.email },
                                {
                                    'is-valid': formik.touched.email && !formik.errors.email,
                                }
                            )}
                            autoComplete='off'
                            disabled={formik.isSubmitting}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.email}</span>
                                </div>
                            </div>
                        )}
                        {/* end::Input */}
                    </div>
                    {/* end::Input group */}
                    
                    {/* begin::Input group */}
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className='required fw-bold fs-4 mb-2'>Contraseña</label>
                        {/* end::Label */}

                        {/* begin::Input */}
                        <input
                            placeholder='Contraseña'
                            {...formik.getFieldProps('password')}
                            type='password'
                            name='password'
                            className={clsx(
                                'form-control form-control-solid mb-3 mb-lg-0',
                                { 'is-invalid': formik.touched.password && formik.errors.password },
                                {
                                    'is-valid': formik.touched.password && !formik.errors.password,
                                }
                            )}
                            autoComplete='off'
                            disabled={formik.isSubmitting}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.password}</span>
                                </div>
                            </div>
                        )}
                        {/* end::Input */}
                    </div>
                    {/* end::Input group */}
                    
                    {/* begin::Input group */}
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className='required fw-bold fs-4 mb-2'>Repetir contraseña</label>
                        {/* end::Label */}

                        {/* begin::Input */}
                        <input
                            placeholder='Repetir contraseña'
                            {...formik.getFieldProps('passwordConfirmation')}
                            type='password'
                            name='passwordConfirmation'
                            className={clsx(
                                'form-control form-control-solid mb-3 mb-lg-0',
                                { 'is-invalid': formik.touched.passwordConfirmation && formik.errors.passwordConfirmation },
                                {
                                    'is-valid': formik.touched.passwordConfirmation && !formik.errors.passwordConfirmation,
                                }
                            )}
                            autoComplete='off'
                            disabled={formik.isSubmitting}
                        />
                        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.passwordConfirmation}</span>
                                </div>
                            </div>
                        )}
                        {/* end::Input */}
                    </div>
                    {/* end::Input group */}
                </div>
                {/* end::Scroll */}
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    type='submit'
                    className='btn btn-primary'
                    data-kt-users-modal-action='submit'
                    disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
                >
                    <span className='indicator-label'>Crear</span>
                    {
                        formik.isSubmitting && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    }
                </button>
            </div>
            {/* begin::Scroll */}

        </form>
    </CustomModal>
}

export default CreateUserModal;
