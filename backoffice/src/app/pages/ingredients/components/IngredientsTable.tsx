
import React from 'react'
import { Ingredient } from '../../../../api/ingredients/Ingredient'
import DeleteIngredientModal from './DeleteIngredientModal';
import { useDeleteIngredient, useUpdateIngredient } from '../../../../api/ingredients';
import EditIngredientModal from './EditIngredientModal';
import { useNotifier } from '../../../../hooks/useNotifier';
import Table from '../../../../components/Table';

type Props = {
    ingredients: Ingredient[];
}

const IngredientsTable: React.FC<Props> = ({ ingredients }) => {
    const [editIngredient, setEditIngredient] = React.useState<Ingredient>();
    const [deleteIngredient, setDeleteIngredient] = React.useState<Ingredient>();

    const { notifySuccess } = useNotifier();

    const editIngredientAction = useUpdateIngredient();
    const deleteIngredientAction = useDeleteIngredient();

    const onCloseEdit = () => {
        setEditIngredient(undefined);
    }

    const onEdit = async (values: {
        name: string;
        image: File;
    }) => {
        await editIngredientAction.mutateAsync({
            id: editIngredient!.id,
            name: values.name,
            image: values.image,
        }).then(() => {
            notifySuccess('Ingrediente editado correctamente');
        });
    }

    const onCloseDelete = () => {
        setDeleteIngredient(undefined);
    }

    const onDelete = async (ingredient: Ingredient) => {
        deleteIngredientAction.mutateAsync(ingredient.id).then(() => {
            onCloseDelete();
            notifySuccess('Ingrediente eliminado correctamente');
        });
    }

    return (
        <>
            {
                editIngredient && <EditIngredientModal
                    ingredient={editIngredient}
                    onClose={onCloseEdit}
                    onEdit={onEdit} />
            }
            {
                deleteIngredient && <DeleteIngredientModal
                    ingredient={deleteIngredient}
                    onClose={onCloseDelete}
                    onDelete={onDelete}
                    loading={deleteIngredientAction.isLoading} />
            }
            <Table headers={['Ingrediente']} data={ingredients.map((ingredient) => ({
                values: {
                    'Ingrediente': <div className='d-flex align-items-center'>
                        <div className='symbol symbol-50px me-5'>
                            <img
                                src={ingredient.image}
                                className=''
                                alt={ingredient.name}
                            />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                {ingredient.name}
                            </a>
                        </div>
                    </div>,
                },
                actions: {
                    onEdit: () => { setEditIngredient(ingredient) },
                    onDelete: () => { setDeleteIngredient(ingredient) },
                }
            }))} />
        </>
    )
}

export { IngredientsTable }
