
import React from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { Category } from '../../../../api/categories/Category'
import DeleteCategoryModal from './DeleteCategoryModal';
import { useDeleteCategory, useUpdateCategory } from '../../../../api/categories';
import EditCategoryModal from './EditCategoryModal';
import { useNotifier } from '../../../../hooks/useNotifier';
import Table from '../../../../components/Table';

type Props = {
    categories: Category[];
}

const CategoriesTable: React.FC<Props> = ({ categories }) => {
    const [editCategory, setEditCategory] = React.useState<Category>();
    const [deleteCategory, setDeleteCategory] = React.useState<Category>();

    const { notifySuccess } = useNotifier();

    const editCategoryAction = useUpdateCategory();
    const deleteCategoryAction = useDeleteCategory();

    const onCloseEdit = () => {
        setEditCategory(undefined);
    }

    const onEdit = async (values: {
        name: string;
        image: File;
    }) => {
        await editCategoryAction.mutateAsync({
            id: editCategory!.id,
            name: values.name,
            image: values.image,
        }).then(() => {
            notifySuccess('Categoría editada correctamente');
        });
    }

    const onCloseDelete = () => {
        setDeleteCategory(undefined);
    }

    const onDelete = async (category: Category) => {
        deleteCategoryAction.mutateAsync(category.id).then(() => {
            onCloseDelete();
            notifySuccess('Categoría eliminada correctamente');
        });
    }

    return (
        <>
            {
                editCategory && <EditCategoryModal
                    category={editCategory}
                    onClose={onCloseEdit}
                    onEdit={onEdit} />
            }
            {
                deleteCategory && <DeleteCategoryModal
                    category={deleteCategory}
                    onClose={onCloseDelete}
                    onDelete={onDelete}
                    loading={deleteCategoryAction.isLoading} />
            }
            <Table headers={['Categoría']} data={categories.map((category) => ({
                values: {
                    'Categoría': <div className='d-flex align-items-center'>
                        <div className='symbol symbol-50px me-5'>
                            <img
                                src={category.image}
                                className=''
                                alt={category.name}
                            />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                {category.name}
                            </a>
                        </div>
                    </div>,
                },
                actions: {
                    onEdit: () => { setEditCategory(category) },
                    onDelete: () => { setDeleteCategory(category) },
                }
            }))} />
        </>
    )
}

export { CategoriesTable }
