import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/Content'
import { ProductsTable } from './components/ProductsTable'
import { useGetProducts } from '../../../api/products';
import DefaultPage from '../../../components/DefaultPage';
import { Link } from 'react-router-dom';

const ProductsPage = () => {

  const { data, isLoading } = useGetProducts();

  return (
    <Content>
      <DefaultPage
        title='Productos'
        isLoading={isLoading}
        rightComponent={
          <Link to='/products/new' className='btn btn-primary'>
            <KTIcon iconName='plus' className='fs-2' />
            Nuevo producto
          </Link>
        }>
        {
          data && <ProductsTable products={data} />
        }
      </DefaultPage>
    </Content>
  )
}

export { ProductsPage }