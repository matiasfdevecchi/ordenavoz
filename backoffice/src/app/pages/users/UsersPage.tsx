import { useState } from 'react';
import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/Content'
import { UsersTable } from './components/UsersTable'
import CreateUserModal from './components/create/CreateUserModal';
import { useNotifier } from '../../../hooks/useNotifier';
import { useCreateUser, useGetUsers } from '../../../api/users';
import { UserRole } from '../../../api/users/User';
import DefaultPage from '../../../components/DefaultPage';

const UsersPage = () => {
  const [openNew, setOpenNew] = useState(false);

  const { notifySuccess } = useNotifier();

  const { data, isLoading } = useGetUsers();

  const createUser = useCreateUser();

  const handleOpenNew = () => {
    setOpenNew(true);
  }

  const handleCloseNew = () => {
    setOpenNew(false);
  }

  const handleCreate = async (values: { name: string, email: string, password: string }) => {
    await createUser.mutateAsync({
      name: values.name,
      email: values.email,
      password: values.password,
      role: UserRole.OWNER,
    }).then(() => {
      notifySuccess('Usuario creado correctamente');
    });
  }

  return (
    <Content>
      {openNew && <CreateUserModal onClose={handleCloseNew} onConfirm={handleCreate} />}
      <DefaultPage
        title='Usuarios'
        isLoading={isLoading}
        rightComponent={
          <button className='btn btn-primary' onClick={handleOpenNew}>
            <KTIcon iconName='plus' className='fs-2' />
            Nuevo usuario
          </button>
        }>
        {
          data && <UsersTable users={data} />
        }
      </DefaultPage>
    </Content>
  )
}

export { UsersPage }