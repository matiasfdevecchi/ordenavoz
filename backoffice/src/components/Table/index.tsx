import { FC, ReactNode, useMemo, useState } from "react";
import ListPagination, { ListPaginationProps } from "./ListPagination";

export type RowsData = {
    values: Record<string, ReactNode>;
    child?: ReactNode;
    actions?: {
        onEdit?: () => void;
        onEditLoading?: boolean;
        onDelete?: () => void;
        onDeleteLoading?: boolean;
    };
    customActions?: ReactNode;
}[];

type Props = {
    headers: string[];
    data: RowsData;
    emptyMessage?: string;
    pagination?: ListPaginationProps;
}

const Table: FC<Props> = ({ headers, data, emptyMessage = "No se encontraron resultados.", pagination }) => {
    const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
    const hasActions = useMemo(() => data.some(({ actions, customActions }) => !!actions || !!customActions), [data]);

    const toggleRow = (index: number) => {
        setExpandedRowIndex(expandedRowIndex === index ? null : index);
    }

    if (!headers.length || !data.length && !pagination?.total) {
        return <div className="card-px text-center pt-15 pb-15">
            <p className="text-gray-500 fs-4 fw-semibold py-7">
                {emptyMessage}
            </p>
        </div>
    }

    return (
        <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                    <tr className='fw-bold text-muted bg-light'>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className={`ps-4 fs-5 ${index === 0 ? 'min-w-325px rounded-start text-start' : 'min-w-125px text-center'} ${index === headers.length - 1 && !hasActions ? 'rounded-end' : ''}`}
                            >
                                {header}
                            </th>
                        ))}
                        {hasActions && (
                            <th className='min-w-50px text-end rounded-end'></th>
                        )}
                    </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                    {
                        data.map(({ values, actions, customActions, child }, rowIndex) => (
                            <>
                                <tr key={rowIndex} onClick={() => toggleRow(rowIndex)} style={{ cursor: child ? 'pointer' : 'default' }}>
                                    <td className="text-start">
                                        {child && (
                                            <span className='me-2'>
                                                <i className={`fa ${expandedRowIndex === rowIndex ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
                                            </span>
                                        )}
                                        {values[headers[0]]}
                                    </td>
                                    {headers.slice(1).map((header, colIndex) => (
                                        <td key={colIndex + 1} className='text-center'>
                                            {values[header]}
                                        </td>
                                    ))}
                                    {
                                        customActions && <td className='text-end'>
                                            {customActions}
                                        </td>
                                    }
                                    {actions && (
                                        <td className='text-end'>
                                            {actions.onEdit && (
                                                <a
                                                    onClick={(e) => { e.stopPropagation(); actions.onEdit?.(); }}
                                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                >
                                                    {
                                                        actions.onEditLoading
                                                            ? <span className='spinner-border spinner-border-sm align-middle'></span>
                                                            : <i className='fa fa-pencil'></i>
                                                    }
                                                </a>
                                            )}
                                            {actions.onDelete && (
                                                <a
                                                    onClick={(e) => { e.stopPropagation(); actions.onDelete?.(); }}
                                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                                                >
                                                    {
                                                        actions.onDeleteLoading
                                                            ? <span className='spinner-border spinner-border-sm align-middle'></span>
                                                            : <i className='fa fa-trash'></i>
                                                    }
                                                </a>
                                            )}
                                        </td>
                                    )}
                                </tr>
                                {child && expandedRowIndex === rowIndex && (
                                    <tr key={`${rowIndex}-child`} className='bg-light'>
                                        <td colSpan={headers.length + (hasActions ? 1 : 0)}>
                                            {child}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))
                    }
                </tbody>
                {/* end::Table body */}
            </table>
            {/* end::Table */}
            {
                pagination && <ListPagination {...pagination} />
            }
        </div>
    );
}

export default Table;
