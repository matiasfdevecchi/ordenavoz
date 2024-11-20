
import { useIntl } from 'react-intl'
import { AsideMenuItem } from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()
  return (
    <>
      <AsideMenuItem
        to='/home'
        title='Inicio'
        fontIcon='bi-house'
        bsTitle='Inicio'
        className='py-2'
      />
      <AsideMenuItem
        to='/orders'
        title='Órdenes'
        fontIcon='la-file-invoice'
        bsTitle='Órdenes'
        className='py-2'
      />
      <AsideMenuItem
        to='/products'
        title='Productos'
        fontIcon='la-hamburger'
        bsTitle='Productos'
        className='py-2'
      />
      <AsideMenuItem
        to='/categories'
        title='Categorías'
        fontIcon='la-tag'
        bsTitle='Categorías'
        className='py-2'
      />
      <AsideMenuItem
        to='/ingredients'
        title='Ingredientes'
        fontIcon='la-utensils'
        bsTitle='Ingredientes'
        className='py-2'
      />
      <AsideMenuItem
        to='/mercadopago'
        title='Mercado Pago'
        fontIcon='la-cash-register'
        bsTitle='Mercado Pago'
        className='py-2'
      />
      <AsideMenuItem
        to='/users'
        title='Usuarios'
        fontIcon='la-user-cog'
        bsTitle='Usuarios'
        className='py-2'
      />
      <AsideMenuItem
        to='/config'
        title='Configuración'
        fontIcon='la-cog'
        bsTitle='Configuración'
        className='py-2'
      />
    </>
  )
}
