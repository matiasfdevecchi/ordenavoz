import { FC, useState } from 'react';
import CustomModal from '../../../../../components/CustomModal';
import { Product } from '../../../../../api/products/Product';
import { Variant, OrderItem } from '../../../../../api/orders/Order';
import { IngredientId } from '../../../../../api/ingredients/Ingredient';

type Props = {
    product: Product;
    onAddProduct: (i: OrderItem) => void;
    onClose: () => void;
}

const AddProductModal: FC<Props> = ({ product, onClose, onAddProduct }) => {
    const [removedIngredients, setRemovedIngredients] = useState<Variant['removedIngredients']>([]);

    const handleDecrementRemoved = (ingredientId: IngredientId) => {
        setRemovedIngredients((prevRemovedIngredients) => {
            return prevRemovedIngredients.map(removedIngredient => {
                if (removedIngredient.ingredient.id === ingredientId) {
                    return {
                        ...removedIngredient,
                        quantity: Math.max(0, removedIngredient.quantity - 1)
                    };
                }
                return removedIngredient;
            }).filter(removedIngredient => removedIngredient.quantity > 0);
        });
    };


    const handleIncrementRemoved = (ingredientId: IngredientId) => {
        setRemovedIngredients((prevRemovedIngredients) => {
            const existing = prevRemovedIngredients.find(removedIngredient => removedIngredient.ingredient.id === ingredientId);
            if (existing) {
                return prevRemovedIngredients.map(removedIngredient => {
                    if (removedIngredient.ingredient.id === ingredientId) {
                        return {
                            ...removedIngredient,
                            quantity: removedIngredient.quantity + 1
                        };
                    }
                    return removedIngredient;
                });
            } else {
                const ingredient = product.ingredients.find(i => i.ingredient.id === ingredientId)?.ingredient;
                if (ingredient) {
                    return [...prevRemovedIngredients, { ingredient, quantity: 1 }];
                }
            }
            return prevRemovedIngredients;
        });
    };

    const getAdjustedQuantity = (ingredientId: IngredientId, originalQuantity: number) => {
        const removed = removedIngredients.find(removedIngredient => removedIngredient.ingredient.id === ingredientId)?.quantity || 0;
        return originalQuantity - removed;
    };

    const nonIngredients = product.ingredients.every(i => getAdjustedQuantity(i.ingredient.id, i.quantity) === 0);

    return (
        <CustomModal
            title={`Añadir producto: ${product.name}`}
            onClose={onClose}
        >
            <div className="modal-body">
                <div
                    className='d-flex flex-column me-n7 px-6'
                    id='kt_modal_add_user_scroll'
                    data-kt-scroll='true'
                    data-kt-scroll-activate='{default: false, lg: true}'
                    data-kt-scroll-max-height='auto'
                    data-kt-scroll-dependencies='#kt_modal_add_user_header'
                    data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
                    data-kt-scroll-offset='300px'
                >
                    {
                        product.ingredients.map(i => {
                            const adjustedQuantity = getAdjustedQuantity(i.ingredient.id, i.quantity);
                            return (
                                <div className='d-flex align-items-center mb-7' key={i.ingredient.id}>
                                    {/* begin::Avatar */}
                                    <div className='symbol symbol-50px me-5'>
                                        <img src={i.ingredient.image} className='' alt='' />
                                    </div>
                                    {/* end::Avatar */}
                                    {/* begin::Text */}
                                    <div className='flex-grow-1'>
                                        <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                            {i.ingredient.name}
                                        </a>
                                    </div>
                                    <div className='flex-shrink-1'>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm"
                                                onClick={() => handleIncrementRemoved(i.ingredient.id)}
                                                disabled={adjustedQuantity <= 0}
                                            >
                                                -
                                            </button>
                                            <span className="mx-3">{adjustedQuantity}</span>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm"
                                                onClick={() => handleDecrementRemoved(i.ingredient.id)}
                                                disabled={adjustedQuantity >= i.quantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {/* end::Text */}
                                </div>
                            );
                        })
                    }
                </div>
                {/* end::Scroll */}
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    className='btn btn-primary'
                    data-kt-users-modal-action='submit'
                    disabled={nonIngredients}
                    onClick={() => {
                        onAddProduct({
                            product,
                            price: product.price,
                            variants: [{
                                quantity: 1,
                                removedIngredients,
                            }]
                        });
                        onClose();
                    }}

                >
                    <span className='indicator-label'>Añadir</span>
                    {
                        false && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    }
                </button>
            </div>
        </CustomModal>
    );
};

export default AddProductModal;
