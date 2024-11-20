

import { FC } from 'react'
import clsx from 'clsx'
import { useLayout } from '../core'

const Footer: FC = () => {
  const { classes } = useLayout()
  return (
    <div className={'footer py-4 d-flex flex-lg-column'} id='kt_footer'>
      {/*begin::Container*/}
      <div
        className={clsx(
          classes.footerContainer,
          'd-flex flex-column flex-md-row align-items-center justify-content-between'
        )}
      >
        {/*begin::Copyright*/}
        <div className='text-gray-900 order-2 order-md-1'>
          <span className='text-muted fw-bold me-1'>{new Date().getFullYear()}&copy;</span>
          <span className='text-gray-800 fw-bold'>
            OrdenaVoz
          </span>
        </div>
        {/*end::Copyright*/}
      </div>
      {/*end::Container*/}
    </div>
  )
}

export { Footer }
