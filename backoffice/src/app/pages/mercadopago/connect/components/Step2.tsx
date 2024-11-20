import React, { FC } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'
import { ErrorMessage, Field } from 'formik'

const Step2: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-10'>
        <h2 className='fw-bolder text-gray-900'>Conectar a sucursal</h2>

        <div className='text-gray-500 fw-bold fs-6'>
          Selecciona la sucursal e ingresa un identificador para identificarlo en este sistema.
        </div>
      </div>

      <div className='mb-0 fv-row'>
        <label className='d-flex align-items-center form-label mb-5'>
          Sucursales disponibles
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Sucursales encontradas en tu cuenta de Mercado Pago'
          ></i>
        </label>

        <div className='mb-0'>
          <label className='d-flex flex-stack mb-5 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='bank' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Ordena Voz - Hamburguesería
                </span>
                <span className='fs-6 fw-bold text-gray-500'>
                  62619911
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='1' />
            </span>
          </label>

          <label className='d-flex flex-stack mb-5 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='chart' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Developer Account
                </span>
                <span className='fs-6 fw-bold text-gray-500'>Use images to your post time</span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='2' />
            </span>
          </label>

          <label className='d-flex flex-stack mb-0 cursor-pointer'>
            <span className='d-flex align-items-center me-2'>
              <span className='symbol symbol-50px me-6'>
                <span className='symbol-label'>
                  <KTIcon iconName='chart-pie-4' className='fs-1 text-gray-600' />
                </span>
              </span>

              <span className='d-flex flex-column'>
                <span className='fw-bolder text-gray-800 text-hover-primary fs-5'>
                  Testing Account
                </span>
                <span className='fs-6 fw-bold text-gray-500'>
                  Use images to enhance time travel rivers
                </span>
              </span>
            </span>

            <span className='form-check form-check-custom form-check-solid'>
              <Field className='form-check-input' type='radio' name='accountPlan' value='3' />
            </span>
          </label>
        </div>

        <div className='my-10 fv-row'>
          <label className='form-label mb-3'>Identificador de la sucursal</label>

          <Field
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='accountName'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='accountName' />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step2 }
