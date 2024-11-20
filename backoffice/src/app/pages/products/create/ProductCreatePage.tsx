import { Content } from "../../../../_metronic/layout/components/Content";
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../../../../api/products';
import { useNotifier } from '../../../../hooks/useNotifier';
import { CreateProductProps } from '../../../../api/products/_queries';
import ProductForm from "../components/ProductForm";

const ProductCreatePage = () => {
    const createProduct = useCreateProduct();
    const { notifySuccess } = useNotifier();
    const navigate = useNavigate();

    const onSubmit = async (props: CreateProductProps) => {
        await createProduct.mutateAsync(props)
        notifySuccess('Producto creado correctamente');
        navigate('/products');
    }

    return (
        <Content>
            <ProductForm onSubmit={onSubmit} />
        </Content>
    );
}

export default ProductCreatePage;
