
import React from 'react'
import { Category } from '../../../../api/categories/Category'
import DeleteUserModal from './DeleteUserModal';
import { useNotifier } from '../../../../hooks/useNotifier';
import { User } from '../../../../api/users/User';
import { useDeleteUser } from '../../../../api/users';
import useAuth from '../../../../auth/useAuth';
import Table from '../../../../components/Table';

type Props = {
    users: User[];
}

const UsersTable: React.FC<Props> = ({ users }) => {
    const { user: currentUser } = useAuth();
    const [deleteUser, setDeleteUser] = React.useState<User>();

    const { notifySuccess } = useNotifier();

    const deleteUserAction = useDeleteUser();

    const onCloseDelete = () => {
        setDeleteUser(undefined);
    }

    const onDelete = async (user: User) => {
        deleteUserAction.mutateAsync(user.id).then(() => {
            onCloseDelete();
            notifySuccess('Usuario eliminado correctamente');
        });
    }

    return (
        <>
            {
                deleteUser && <DeleteUserModal
                    user={deleteUser}
                    onClose={onCloseDelete}
                    onDelete={onDelete}
                    loading={deleteUserAction.isLoading} />
            }
            <Table headers={['Nombre', 'Email']} data={users.map((user) => ({
                values: {
                    'Nombre': <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                                {user.name}
                            </a>
                        </div>
                    </div>,
                    'Email': <p className='text-gray-900 fw-bold d-block mb-1 fs-4'>
                        {user.email}
                    </p>,
                },
                actions: {
                    onDelete: currentUser?.id !== user.id
                        ? () => setDeleteUser(user)
                        : undefined,
                }
            }))} />
        </>
    )
}

export { UsersTable }
