import { FC, lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { CategoriesPage } from '../pages/categories/CategoriesPage'
import { UsersPage } from '../pages/users/UsersPage'
import ProtectedRoute from '../../auth/ProtectedRoute'
import { IngredientsPage } from '../pages/ingredients/IngredientsPage'
import { ProductsPage } from '../pages/products/ProductsPage'
import ProductCreatePage from '../pages/products/create/ProductCreatePage'
import ProductEditPage from '../pages/products/edit/ProductEditPage'
import { OrdersPage } from '../pages/orders/OrdersPage'
import OrderCreatePage from '../pages/orders/create/OrderCreatePage'
import OrderPayPage from '../pages/orders/pay/OrderPayPage'
import MercadoPagoPage from '../pages/mercadopago/MercadoPagoPage'
import OrderPage from '../pages/orders/view/OrderPage'
import { HomePage } from '../pages/home/HomePage'
import WebConfigsPage from '../pages/web-configs/WebConfigsPage'

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/home' />} />
        {/* Pages */}
        <Route path='home' element={<HomePage />} />

        <Route path='categories' element={<CategoriesPage />} />

        <Route path='ingredients' element={<IngredientsPage />} />

        <Route path='mercadopago' element={<MercadoPagoPage />} />

        <Route path='orders' element={<OrdersPage />} />
        <Route path='orders/new' element={<OrderCreatePage />} />
        <Route path='orders/:id' element={<OrderPage />} />
        <Route path='orders/:id/pay' element={<OrderPayPage />} />

        <Route path='products' element={<ProductsPage />} />
        <Route path='products/new' element={<ProductCreatePage />} />
        <Route path='products/:id/edit' element={<ProductEditPage />} />

        <Route path='users' element={<UsersPage />} />

        <Route path='config' element={<WebConfigsPage />} />

        <Route path='menu-test' element={<MenuTestPage />} />
        <Route path='LoginCallback' element={<Navigate to='/home' />} />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
