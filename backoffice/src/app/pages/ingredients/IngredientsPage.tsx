import { useState } from 'react';
import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/Content'
import { IngredientsTable } from './components/IngredientsTable'
import CreateIngredientModal from './components/create/CreateIngredientModal';
import { useCreateIngredient, useGetIngredients } from '../../../api/ingredients';
import { useNotifier } from '../../../hooks/useNotifier';
import DefaultPage from '../../../components/DefaultPage';

const IngredientsPage = () => {
  const [openNew, setOpenNew] = useState(false);

  const { notifySuccess } = useNotifier();

  const { data, isLoading, isError } = useGetIngredients();

  const createIngredient = useCreateIngredient();

  const handleOpenNew = () => {
    setOpenNew(true);
  }

  const handleCloseNew = () => {
    setOpenNew(false);
  }

  const handleCreate = async (values: { name: string, image: File }) => {
    await createIngredient.mutateAsync({
      name: values.name,
      image: values.image!,
    }).then(() => {
      notifySuccess('Ingrediente creado correctamente');
    });
  }

  return (
    <Content>
      {openNew && <CreateIngredientModal onClose={handleCloseNew} onConfirm={handleCreate} />}
      <DefaultPage
        title='Ingredientes'
        isLoading={isLoading}
        rightComponent={
          <button className='btn btn-primary' onClick={handleOpenNew}>
            <KTIcon iconName='plus' className='fs-2' />
            Nuevo ingrediente
          </button>
        }>
        {
          data && <IngredientsTable ingredients={data} />
        }
      </DefaultPage>
    </Content>
  )
}

export { IngredientsPage }