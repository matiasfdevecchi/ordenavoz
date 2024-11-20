import { useState } from 'react';
import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/Content'
import { CategoriesTable } from './components/CategoriesTable'
import CreateCategoryModal from './components/create/CreateCategoryModal';
import { useCreateCategory, useGetCategories } from '../../../api/categories';
import { useNotifier } from '../../../hooks/useNotifier';
import DefaultPage from '../../../components/DefaultPage';

const CategoriesPage = () => {
  const [openNew, setOpenNew] = useState(false);

  const { notifySuccess } = useNotifier();

  const { data, isLoading } = useGetCategories();

  const createCategory = useCreateCategory();

  const handleOpenNew = () => {
    setOpenNew(true);
  }

  const handleCloseNew = () => {
    setOpenNew(false);
  }

  const handleCreate = async (values: { name: string, image: File }) => {
    await createCategory.mutateAsync({
      name: values.name,
      image: values.image!,
    }).then(() => {
      notifySuccess('Categoría creada correctamente');
    });
  }

  return (
    <Content>
      {openNew && <CreateCategoryModal onClose={handleCloseNew} onConfirm={handleCreate} />}
      <DefaultPage
        title='Categorías'
        isLoading={isLoading}
        rightComponent={
          <button className='btn btn-primary' onClick={handleOpenNew}>
            <KTIcon iconName='plus' className='fs-2' />
            Nueva categoría
          </button>
        }>
        {
          data && <CategoriesTable categories={data} />
        }
      </DefaultPage>
    </Content>
  )
}

export { CategoriesPage }