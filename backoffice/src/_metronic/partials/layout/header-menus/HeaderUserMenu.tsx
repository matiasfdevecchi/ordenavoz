
import { FC } from 'react'
import useAuth from '../../../../auth/useAuth'

const HeaderUserMenu: FC = () => {
  const { user, logout } = useAuth()
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {user?.name}
            </div>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Salir
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
