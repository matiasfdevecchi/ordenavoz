
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'
import { Topbar } from './Topbar'

export function HeaderWrapper() {
  const { classes, attributes } = useLayout()

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      {/* begin::Container */}
      <div
        className={clsx(
          classes.headerContainer.join(' '),
          'd-flex align-items-stretch justify-content-between'
        )}
      >
        {/* begin::Aside mobile toggle */}

        <div className='d-flex align-items-center d-lg-none ms-n1 me-2' title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_aside_mobile_toggle'
          >
            <KTIcon iconName='abstract-14' className='fs-1' />
          </div>
        </div>
        {/* end::Aside mobile toggle */}

        {/* begin::Mobile logo */}
        <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
          <Link to='/dashboard' className='d-lg-none'>
            <img alt='Logo' src={toAbsoluteUrl('media/logos/logo.png')} className='h-30px' />
          </Link>
        </div>
        {/* end::Mobile logo */}

        {/* begin::Wrapper */}
        <div className={'d-flex align-items-stretch justify-content-end flex-lg-grow-1'}>
          <Topbar />
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Container */}
    </div>
  )
}
