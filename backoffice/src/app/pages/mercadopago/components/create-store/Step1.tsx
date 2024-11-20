import * as Yup from 'yup'
import { useFormik } from 'formik';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { useGetMercadoPagoStores } from '../../../../../api/mercadopago/services/stores';
import { KTIcon } from '../../../../../_metronic/helpers';
import { useNotifier } from '../../../../../hooks/useNotifier';
import { Store } from '../../../../../api/mercadopago/stores/Store';

const userIdSchema = Yup.object().shape({
  userId: Yup.number().required('Requerido').typeError('Solo números'),
})

type Props = {
  selectedUserId: number | undefined;
  setSelectedUserId: (userId: number | undefined) => void;
  nextStep: (stores: Store[]) => void;
}

const Step1: FC<Props> = ({ nextStep, selectedUserId, setSelectedUserId }) => {
  const { data, isLoading, isError } = useGetMercadoPagoStores(selectedUserId);
  const { notifyError } = useNotifier();

  useEffect(() => {
    if (isError) {
      setSelectedUserId(undefined);
    }
  }, [isError]);

  useEffect(() => {
    if (!data) return;
    if (data.length === 0) {
      notifyError("No hay locales creados en tu negocio de Mercado Pago");
      return;
    }
    nextStep(data);
  }, [data]);

  const formik = useFormik({
    initialValues: {
      userId: '',
    },
    validationSchema: userIdSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("submitting")
      setSubmitting(true)
      try {
        if (selectedUserId === Number(values.userId)) {
          if (!data) return;
          if (data.length === 0) {
            notifyError("No hay locales creados en tu negocio de Mercado Pago");
            return;
          }
          nextStep(data);
        } else {
          setSelectedUserId(Number(values.userId));
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (<div className='current' data-kt-stepper-element='content'>

    <form id='kt_modal_add_user_form' className='form w-100' onSubmit={formik.handleSubmit} noValidate>
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
          <div className='pb-10 pb-lg-10'>
            <h2 className='fw-bolder text-gray-900'>Conectar cuenta</h2>

            <div className='text-gray-500 fw-bold fs-6'>
              Ingrese el ID de usuario para conectarse a su negocio.
            </div>
          </div>
          {/* begin::Label */}
          <label className='required fw-bold fs-4 mb-2'>ID de usuario</label>
          {/* end::Label */}

          {/* begin::Input */}
          <input
            placeholder='ID de usuario'
            {...formik.getFieldProps('userId')}
            type='text'
            name='userId'
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
              { 'is-invalid': formik.touched.userId && formik.errors.userId },
              {
                'is-valid': formik.touched.userId && !formik.errors.userId,
              }
            )}
            autoComplete='off'
            disabled={formik.isSubmitting}
          />
          {formik.touched.userId && formik.errors.userId && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.userId}</span>
              </div>
            </div>
          )}
          {/* end::Input */}
        </div>
        {/* end::Input group */}
      </div>
      {/* end::Scroll */}

      <button
        type='submit'
        className='btn btn-lg btn-primary float-end'
        disabled={formik.isSubmitting || !formik.isValid || !formik.touched || !formik.dirty}
      >
        Continuar
        {
          (!formik.isSubmitting && !isLoading) && <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
        }
        {
          (formik.isSubmitting || isLoading) && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
        }
      </button>
    </form>
  </div>
  )
}

export default Step1
