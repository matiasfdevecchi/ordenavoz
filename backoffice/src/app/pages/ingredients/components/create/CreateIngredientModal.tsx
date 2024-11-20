import { FC, useMemo } from 'react'
import * as Yup from 'yup'
import CustomModal from '../../../../../components/CustomModal';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useFormik } from 'formik';
import clsx from 'clsx';

type Props = {
    initialValues?: {
        name: string;
        image: File;
    };
    onClose: () => void;
    onConfirm: (values: { name: string, image: File }) => Promise<void>;
}

const editUserSchema = Yup.object().shape({
    image: Yup.mixed().required('Requerido'),
    name: Yup.string().required('Requerido'),
})

const CreateIngredientModal: FC<Props> = ({ initialValues, onClose, onConfirm }) => {

    const blankImg = toAbsoluteUrl('media/svg/files/blank-image.svg')

    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            image: undefined,
        },
        validationSchema: editUserSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
                await onConfirm({
                    name: values.name,
                    image: values.image!,
                });
                onClose()
            } catch (ex) {
                console.error(ex)
            } finally {
                setSubmitting(false)
            }
        },
    })

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            const file = event.currentTarget.files[0]
            formik.setFieldValue('image', file)
        }
    }

    const userAvatarImg = useMemo(() => formik.values.image ? URL.createObjectURL(formik.values.image) : blankImg, [formik.values.image, blankImg]);

    return <CustomModal
        title={`${initialValues ? 'Editar' : 'Crear'} ingrediente`}
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
                        <label className='d-block fw-bold fs-4 mb-5'>Imagen</label>
                        {/* end::Label */}

                        {/* begin::Image input */}
                        <div
                            className='image-input image-input-outline'
                            data-kt-image-input='true'
                            style={{ backgroundImage: `url('${blankImg}')` }}
                        >
                            {/* begin::Preview existing avatar */}
                            <div
                                className='image-input-wrapper w-125px h-125px'
                                style={{ backgroundImage: `url('${userAvatarImg}')` }}
                            ></div>
                            {/* end::Preview existing avatar */}

                            {/* begin::Label */}
                            <label
                                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                                data-kt-image-input-action='change'
                                data-bs-toggle='tooltip'
                                title='Change avatar'
                            >
                                <i className='bi bi-pencil-fill fs-7'></i>

                                <input type='file' name='image' accept='.png, .jpg, .jpeg' onChange={handleImageChange} />
                                <input type='hidden' name='avatar_remove' />
                            </label>
                            {/* end::Label */}

                            {/* begin::Cancel */}
                            <span
                                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                                data-kt-image-input-action='cancel'
                                data-bs-toggle='tooltip'
                                title='Cancel avatar'
                            >
                                <i className='bi bi-x fs-2'></i>
                            </span>
                            {/* end::Cancel */}
                        </div>
                        {/* end::Image input */}
                    </div>
                    {/* end::Input group */}

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
                    <span className='indicator-label'>{initialValues ? 'Editar' : 'Crear'}</span>
                    {
                        formik.isSubmitting && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    }
                </button>
            </div>
            {/* begin::Scroll */}

        </form>
    </CustomModal>
}

export default CreateIngredientModal;
