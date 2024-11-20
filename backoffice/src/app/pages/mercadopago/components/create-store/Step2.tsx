import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { KTIcon } from '../../../../../_metronic/helpers';
import { Store } from '../../../../../api/mercadopago/stores/Store';

type Props = {
  stores: Store[];
  prevStep: () => void;
  handleSubmit: (values: { store: string, externalId: string }) => void;
  isLoading: boolean;
}

const Step2: FC<Props> = ({ stores, prevStep, handleSubmit, isLoading }) => {
  const formik = useFormik({
    initialValues: {
      store: '',
      externalId: '',
    },
    validationSchema: Yup.object().shape({
      store: Yup.string().required('Seleccionar un local es obligatorio'),
      externalId: Yup.string().required('El identificador del negocio es obligatorio'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmit(values);
      setSubmitting(false);
    },
  });

  return (
    <div className='w-100' data-kt-stepper-element='content'>
      <form id='kt_modal_add_user_form' className='form w-100' onSubmit={formik.handleSubmit} noValidate>
        <div className='mb-0 fv-row'>
          <div className='pb-10 pb-lg-10'>
            <h2 className='fw-bolder text-gray-900'>Seleccionar local</h2>
            <div className='text-gray-500 fw-bold fs-6'>
              Seleccione el local e ingresa un identificador para identificarlo en este sistema.
            </div>
          </div>
          <label className='d-flex align-items-center form-label mb-5'>
            Locales disponibles
            <i
              className='fas fa-exclamation-circle ms-2 fs-7'
              data-bs-toggle='tooltip'
              title='Locales encontrados en tu negocio de Mercado Pago'
            ></i>
          </label>

          <div className='mb-0'>
            {
              stores.map((store) => (
                <label key={store.id} className='d-flex flex-stack mb-5 cursor-pointer'>
                  <span className='d-flex align-items-center me-2'>
                    <span className='symbol symbol-50px me-6'>
                      <span className='symbol-label'>
                        <KTIcon iconName='bank' className='fs-1 text-gray-600' />
                      </span>
                    </span>

                    <span className='d-flex flex-column'>
                      <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                        {store.name}
                      </span>
                      <span className='fs-6 fw-bold text-gray-500'>
                        {store.id}
                      </span>
                    </span>
                  </span>

                  <span className='form-check form-check-custom form-check-solid'>
                    <input
                      type='radio'
                      name='store'
                      value={store.id}
                      className={clsx(
                        'form-check-input',
                        { 'is-invalid': formik.touched.store && formik.errors.store }
                      )}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.store === store.id}
                    />
                  </span>
                </label>
              ))
            }
            {formik.touched.store && formik.errors.store && (
              <div className='text-danger mt-2'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.store}</span>
                </div>
              </div>
            )}
          </div>

          <div className='my-10 fv-row'>
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

          <div className='d-flex flex-stack pt-10 justify-content-end'>
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
                type='submit'
                className='btn btn-lg btn-primary'
                data-kt-stepper-action='submit'
                disabled={formik.isSubmitting || !formik.isValid || !formik.touched || !formik.dirty}
              >
                Crear
                {
                  (!formik.isSubmitting && !isLoading) && <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
                }
                {
                  (formik.isSubmitting || isLoading) && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Step2;
