import { FC } from 'react'
import clsx from 'clsx'
import { toAbsoluteUrl } from '../../../helpers'
import {
  HeaderUserMenu,
} from '../../../partials'
import useAuth from '../../../../auth/useAuth'

const itemClass = 'ms-1 ms-lg-3',
  userAvatarClass = 'symbol-30px symbol-md-40px'

const Topbar: FC = () => {
  const { user } = useAuth();

  const userAvatar = user?.picture ? user.picture : toAbsoluteUrl('media/avatars/blank.png')

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>

      {/* begin::User */}
      <div className={clsx('d-flex align-items-center', itemClass)} id='kt_header_user_menu_toggle'>
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={userAvatar} alt='Tu perfil' />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}
    </div>
  )
}

export { Topbar }
