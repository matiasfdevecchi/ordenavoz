import { FC, useState } from "react";
import { Cashier } from "../../../../api/mercadopago/cashiers/Cashier";
import Table, { RowsData } from "../../../../components/Table";
import { useDeleteCashier } from "../../../../api/mercadopago/cashiers";
import DeleteCashierModal from "./DeleteCashierModal";

type Props = {
    cashiers: Cashier[];
}

const CashierTable: FC<Props> = ({ cashiers }) => {
    const deleteCashierAction = useDeleteCashier();
    const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({}); // Estado para controlar el loading por fila
    const [openDeleteCashier, setOpenDeleteCashier] = useState<Cashier | undefined>(undefined);

    const handleCloseDeleteCashier = () => {
        setOpenDeleteCashier(undefined);
    }

    const handleOpenDeleteCashier = (cashier: Cashier) => {
        setOpenDeleteCashier(cashier);
    }

    const headers = ["Nombre de la Caja", "ID de la Caja", "Fecha de Creación", "ID Externo"];

    const handleDelete = async (cashier: Cashier) => {
        const cashierId = cashier.id;
        setLoadingStates(prev => ({ ...prev, [cashierId]: true })); // Inicia loading para esta fila
        try {
            await deleteCashierAction.mutateAsync(cashierId);
        } catch (error) {
            console.error("Error deleting cashier:", error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [cashierId]: false })); // Finaliza loading para esta fila
            handleCloseDeleteCashier();
        }
    };

    const data: RowsData = cashiers.map((cashier) => ({
        values: {
            "Nombre de la Caja": <div className='d-flex align-items-center'>
                <div className='d-flex justify-content-start flex-column'>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                        {cashier.name}
                    </a>
                </div>
            </div>,
            "ID de la Caja": <span className='text-gray-600 fw-bold fs-4'>{cashier.id.toString()}</span>,
            "Fecha de Creación": <span className='text-gray-600 fw-bold fs-4'>{new Date(cashier.dateCreation).toLocaleDateString()}</span>,
            "ID Externo": <span className='text-gray-600 fw-bold fs-4'>{cashier.externalId || "N/A"}</span>,
        },
        actions: {
            onDelete: () => handleOpenDeleteCashier(cashier),
            onDeleteLoading: loadingStates[cashier.id] || false, // Usa el estado de loading específico para esta fila
        }
    }));

    return (
        <>
            {openDeleteCashier && <DeleteCashierModal cashier={openDeleteCashier} onClose={handleCloseDeleteCashier} onDelete={handleDelete} loading={deleteCashierAction.isLoading} />}
            <div className="mt-10">
                <Table
                    headers={headers}
                    data={data}
                    emptyMessage="No hay cajas registradas."
                />
            </div>
        </>
    );
}

export default CashierTable;
