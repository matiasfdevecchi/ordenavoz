import React from 'react';
import { IngredientId } from "../../../../api/ingredients/Ingredient";
import { ProductIngredient } from "../../../../api/products/Product";
import Table from "../../../../components/Table";

type Props = {
    ingredients: ProductIngredient[];
    onUpdateQuantity: (ingredientId: IngredientId, quantity: number) => void;
    onDelete: (index: number) => void;
}

const IngredientsTable: React.FC<Props> = ({ ingredients, onUpdateQuantity, onDelete }) => {
    const handleIncrement = (ingredientId: IngredientId) => {
        const ingredient = ingredients.find(i => i.ingredient.id === ingredientId);
        if (ingredient) {
            onUpdateQuantity(ingredientId, ingredient.quantity + 1);
        }
    };

    const handleDecrement = (ingredientId: IngredientId) => {
        const ingredient = ingredients.find(i => i.ingredient.id === ingredientId);
        if (ingredient && ingredient.quantity > 1) {
            onUpdateQuantity(ingredientId, ingredient.quantity - 1);
        }
    };

    return (
        <Table
            headers={["Ingrediente", "Cantidad"]}
            data={
                ingredients.map((ingredient, index) => ({
                    values: {
                        "Ingrediente": (
                            <div className='d-flex align-items-center'>
                                <div className='symbol symbol-50px me-5'>
                                    <img
                                        src={ingredient.ingredient.image}
                                        className=''
                                        alt={ingredient.ingredient.name}
                                    />
                                </div>
                                <div className='d-flex justify-content-start flex-column'>
                                    <span className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                        {ingredient.ingredient.name}
                                    </span>
                                </div>
                            </div>
                        ),
                        "Cantidad": (
                            <div className="d-flex align-items-center justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() => handleDecrement(ingredient.ingredient.id)}
                                >
                                    -
                                </button>
                                <span className="mx-3">{ingredient.quantity}</span>
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    onClick={() => handleIncrement(ingredient.ingredient.id)}
                                >
                                    +
                                </button>
                            </div>
                        )
                    },
                    actions: {
                        onDelete: () => onDelete(index)
                    }
                }))
            }
            emptyMessage="Aún no se han agregado ingredientes."
        />
    );
};

export default IngredientsTable;
