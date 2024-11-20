
import React from 'react'
import { Product } from '../../../../api/products/Product'
import Table from '../../../../components/Table';
import { useDeleteProduct } from '../../../../api/products';
import { useNotifier } from '../../../../hooks/useNotifier';
import DeleteProductModal from './DeleteProductModal';
import { useNavigate } from 'react-router-dom';

type Props = {
    products: Product[];
}

const ProductsTable: React.FC<Props> = ({ products }) => {
    const [deleteProduct, setDeleteProduct] = React.useState<Product>();
    const { notifySuccess } = useNotifier();
    const navigate = useNavigate();

    const deleteProductAction = useDeleteProduct();

    const onCloseDelete = () => {
        setDeleteProduct(undefined);
    }

    const onDelete = async (product: Product) => {
        deleteProductAction.mutateAsync(product.id).then(() => {
            onCloseDelete();
            notifySuccess('Producto eliminado correctamente');
        });
    }

    const navigateToEdit = (id: Product['id']) => {
        navigate(`/products/${id}/edit`);
    }

    return (
        <>
            {
                deleteProduct && <DeleteProductModal
                    product={deleteProduct}
                    onClose={onCloseDelete}
                    onDelete={onDelete}
                    loading={deleteProductAction.isLoading} />
            }
            <Table headers={['Producto', 'Categoría', 'Precio']} data={products.map((product) => ({
                values: {
                    'Producto': <div className='d-flex align-items-center'>
                        <div className='symbol symbol-50px me-5'>
                            <img
                                src={product.image}
                                className=''
                                alt={product.name}
                            />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                {product.name}
                            </a>
                        </div>
                    </div>,
                    'Categoría': <div className='d-flex justify-content-center align-items-center'>
                        <div className='symbol symbol-50px me-5'>
                            <img
                                src={product.category.image}
                                className=''
                                alt={product.category.name}
                            />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                {product.category.name}
                            </a>
                        </div>
                    </div>,
                    'Precio': <span className='text-gray-600 fw-bold fs-4'>${product.price}</span>,
                },
                actions: {
                    onEdit: () => { navigateToEdit(product.id) },
                    onDelete: () => { setDeleteProduct(product) },
                }
            }))} />
        </>
    )
}

export { ProductsTable }
