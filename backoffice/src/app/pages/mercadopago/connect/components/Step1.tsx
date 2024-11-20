
import { FC } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'
import { ErrorMessage, Field } from 'formik'

const Step1: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder d-flex align-items-center text-gray-900'>
          Conectar cuenta de Mercado Pago
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Billing is issued based on your selected account type'
          ></i>
        </h2>

        <div className='text-gray-500 fw-bold fs-6'>
          Obtenga su ID de usuario e insértelo en el campo de texto a continuación.
        </div>
      </div>

      <div className='fv-row'>
        <div className='row'>
          {/* begin::Input group */}
          <div className="mb-10 fv-row">
            <label className="required form-label">ID de usuario</label>
            <input
              placeholder='Nombre'
              type='text'
              name='name'
              className='form-control form-control-solid mb-3 mb-lg-0'
              autoComplete='off'
            />
          </div>
          {/* end::Input group */}

          <div className='text-danger mt-2'>
            <ErrorMessage name='accountType' />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step1 }
