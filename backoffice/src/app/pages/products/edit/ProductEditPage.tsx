import { Content } from "../../../../_metronic/layout/components/Content";
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProduct, useGetProductById, useUpdateProduct } from '../../../../api/products';
import { useNotifier } from '../../../../hooks/useNotifier';
import { CreateProductProps } from '../../../../api/products/_queries';
import ProductForm from "../components/ProductForm";
import { urlToFile } from "../../../../utils/imageUtils";
import { useEffect, useState } from "react";

const ProductEditPage = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetProductById(parseInt(id || '0'));

    const [image, setImage] = useState<File>();

    const updateProduct = useUpdateProduct();
    const { notifySuccess } = useNotifier();
    const navigate = useNavigate();

    const onSubmit = async (props: CreateProductProps) => {
        await updateProduct.mutateAsync({
            ...props,
            id: parseInt(id || '0'),
        })
        notifySuccess('Producto actualizado correctamente');
        navigate('/products');
    }

    useEffect(() => {
        const fetchImage = async () => {
            if (data) {
                setImage(await urlToFile(data.image));
            }
        }
        fetchImage();
    }, [data]);

    return (
        <Content>
            {
                isLoading && <div className="text-center">
                    <span className='spinner-border spinner-border-sm align-middle ms-2 m-10'></span>
                </div>
            }
            {
                data && !isLoading && image && <ProductForm
                    initialValues={{
                        productName: data.name,
                        price: data.price.toString(),
                        categoryId: data.category.id,
                        ingredients: data.ingredients.map(i => ({
                            ingredientId: i.ingredient.id,
                            quantity: i.quantity
                        })),
                        image,
                        selectedIngredient: undefined
                    }}
                    onSubmit={onSubmit} />
            }
        </Content>
    );
}

export default ProductEditPage;
