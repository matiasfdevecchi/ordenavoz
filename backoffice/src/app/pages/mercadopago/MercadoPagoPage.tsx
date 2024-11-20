import React, { useMemo, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/Content";
import DefaultPage from "../../../components/DefaultPage";
import CreateStoreModal from "./components/create-store/CreateStoreModal";
import { useDeleteStore, useGetStores } from "../../../api/mercadopago/stores";
import StoreData from "./components/StoreData";
import CashierTable from "./components/CashierTable";
import CreateCashierModal from "./components/create-cashier/CreateCashierModal";
import DeleteStoreModal from "./components/DeleteStoreModal";
import { Store } from "../../../api/mercadopago/stores/Store";

const MercadoPagoPage = () => {
    const [openNewStore, setOpenNewStore] = useState(false);
    const [openNewCashier, setOpenNewCashier] = useState(false);
    const [openDeleteStore, setOpenDeleteStore] = useState<Store | undefined>(undefined);

    const handleCloseDeleteStore = () => {
        setOpenDeleteStore(undefined);
    }

    const handleOpenDeleteStore = (store: Store) => {
        setOpenDeleteStore(store);
    }

    const handleDeleteStore = async (store: Store) => {
        await deleteStoreAction.mutateAsync(store.id);
        handleCloseDeleteStore();
    }

    const { data: stores, isLoading } = useGetStores();
    const deleteStoreAction = useDeleteStore();

    const store = useMemo(() => {
        if (stores && stores.length > 0) {
            return stores[0];
        }
        return undefined;
    }, [stores]);

    const handleNewStore = () => {
        setOpenNewStore(true);
    }

    const handleCloseNewStore = () => {
        setOpenNewStore(false);
    }

    const handleNewCashier = () => {
        setOpenNewCashier(true);
    }

    const handleCloseNewCashier = () => {
        setOpenNewCashier(false);
    }

    return (
        <Content>
            { openDeleteStore && <DeleteStoreModal store={openDeleteStore} onClose={handleCloseDeleteStore} onDelete={handleDeleteStore} loading={deleteStoreAction.isLoading} /> }
            {openNewStore && <CreateStoreModal onClose={handleCloseNewStore} />}
            {openNewCashier && store && <CreateCashierModal store={store} onClose={handleCloseNewCashier} />}
            <DefaultPage
                title="Mercado Pago"
                rightComponent={
                    <>
                        {
                            !store && <button className='btn btn-primary' onClick={handleNewStore}>
                                <KTIcon iconName='plus' className='fs-2' />
                                Nuevo local
                            </button>
                        }
                        {
                            store && <button className='btn btn-primary' onClick={handleNewCashier}>
                                <KTIcon iconName='plus' className='fs-2' />
                                Nueva caja
                            </button>
                        }
                        {
                            // remove store button outlined
                            store && <button className='btn btn-outline btn-outline-danger ms-5' onClick={() => handleOpenDeleteStore(store)}>
                                {
                                    deleteStoreAction.isLoading
                                        ? <span className='spinner-border spinner-border-sm align-middle' style={{marginLeft: '0.2em', marginRight: '0.6em'}}></span>
                                        : <KTIcon iconName='trash' className='fs-2' />
                                }
                                Eliminar local
                            </button>
                        }
                    </>
                }
                isLoading={isLoading}
                isLoadingRightComponent={isLoading}
            >
                {/* Render the StoreTable */}
                {
                    stores && stores.length === 0 && <div className="card-px text-center pt-15 pb-15">
                        <p className="text-gray-500 fs-4 fw-semibold py-7">
                            Aún no conectaste tu local
                        </p>
                    </div>
                }
                {
                    store && <>
                        <StoreData store={store} />
                        <CashierTable cashiers={store.cashiers || []} />
                    </>
                }
            </DefaultPage>
        </Content>
    );
};

export default MercadoPagoPage;
