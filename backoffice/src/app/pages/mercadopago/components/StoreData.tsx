import React, { FC } from "react";
import { Store } from "../../../../api/mercadopago/stores/Store";

type Props = {
    store: Store;
}

const StoreData: FC<Props> = ({ store }) => {
    return (
        <>
            <h4 className="card-title">{store.name}</h4>
            <h6 className="card-subtitle mb-2 text-muted">ID: {store.id}</h6>
            <h6 className="card-subtitle mb-2 text-muted">Fecha de Creación: {new Date(store.dateCreation).toLocaleDateString()}</h6>
            {store.externalId && (
                <h6 className="card-subtitle mb-2 text-muted">ID Externo: {store.externalId}</h6>
            )}
            <h6 className="card-subtitle mb-2 text-muted">ID de Usuario: {store.userId}</h6>
        </>
    );
}

export default StoreData;
