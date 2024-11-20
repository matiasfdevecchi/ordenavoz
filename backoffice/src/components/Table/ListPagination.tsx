import clsx from 'clsx'
import { FC, ReactNode, useMemo } from 'react'

const INITIAL_PAGE = 0; // Página inicial, internamente es 0

const mappedLabel = (label: string): ReactNode => {
  if (label === 'First') {
    return <i className="ki-duotone ki-double-left fs-2">
      <span className="path1"></span>
      <span className="path2"></span>
    </i>;
  }
  if (label === 'Previous') {
    return <i className="ki-duotone ki-left fs-2"></i>
  }

  if (label === 'Next') {
    return <i className="ki-duotone ki-right fs-2"></i>
  }

  if (label === 'Last') {
    return <i className="ki-duotone ki-double-right fs-2">
      <span className="path1"></span>
      <span className="path2"></span>
    </i>
  }

  return label
}

type Box = {
  label: string;
  active: boolean;
  page: number | undefined;
};

export type ListPaginationProps = {
  current: number;
  total: number;
  boxQuantity: number;
  goToPage: (page: number) => void;
  previousAndNext?: boolean;
  firstAndLast?: boolean;
}

const ListPagination: FC<ListPaginationProps> = ({
  current,
  total,
  goToPage,
  boxQuantity,
  previousAndNext = true,
  firstAndLast = true,
}) => {

  const isActive = (label: string) => {
    const pageNumber = parseInt(label) - 1;
    if (label === 'First') {
      return current === INITIAL_PAGE;
    }
    if (label === 'Previous') {
      return current === INITIAL_PAGE;
    }
    if (label === 'Next') {
      return current === total - 1;
    }
    if (label === 'Last') {
      return current === total - 1;
    }
    return current === pageNumber;
  }

  const isDisabled = (label: string) => {
    if (label === 'First') {
      return isActive((INITIAL_PAGE + 1).toString());
    }
    if (label === 'Previous') {
      return isActive((INITIAL_PAGE + 1).toString());
    }
    if (label === 'Next') {
      return isActive((total).toString());
    }
    if (label === 'Last') {
      return isActive((total).toString());
    }
    return false;
  }

  const applyPreviousAndNext = (boxes: Box[]): Box[] => {
    return [
      {
        label: 'Previous',
        active: false,
        page: current - 1,
      },
      ...boxes,
      {
        label: 'Next',
        active: false,
        page: current + 1,
      },
    ]
  }

  const applyFirstAndLast = (boxes: Box[]): Box[] => {
    return [
      {
        label: 'First',
        active: false,
        page: INITIAL_PAGE,
      },
      ...boxes,
      {
        label: 'Last',
        active: false,
        page: total - 1,
      },
    ]
  }

  const boxes: Box[] = useMemo(() => {
    let boxes: Box[] = [];
    let bottomLimit = current - Math.floor(boxQuantity / 2);
    let topLimit = current + Math.floor(boxQuantity / 2);

    if (bottomLimit < INITIAL_PAGE) {
      bottomLimit = INITIAL_PAGE;
    }
    if (topLimit > total - 1) {
      topLimit = total - 1;
    }

    for (let i = bottomLimit; i <= topLimit; i++) {
      boxes.push({
        label: (i + 1).toString(), // Label a partir de 1
        active: i === current,
        page: i,
      });
    }

    if (boxes[0].page && boxes[0].page > INITIAL_PAGE) {
      boxes.unshift({
        label: '...',
        active: false,
        page: undefined,
      });
    }

    const lastBox = boxes[boxes.length - 1].page;
    if (lastBox && lastBox < total - 2) {
      boxes.push({
        label: '...',
        active: false,
        page: undefined,
      });
    }

    if (previousAndNext) {
      boxes = applyPreviousAndNext(boxes);
    }

    if (firstAndLast) {
      boxes = applyFirstAndLast(boxes);
    }

    return boxes;
  }, [current, total, boxQuantity, firstAndLast, previousAndNext]);

  return (
    <div className='row mx-0'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_users_paginate'>
          <ul className='pagination'>
            {boxes
              ?.map((link) => {
                return { ...link, key: link.label, label: mappedLabel(link.label) }
              })
              .map((link) => (
                <li
                  key={link.key}
                  className={clsx('page-item', {
                    active: isActive(link.key),
                    disabled: isDisabled(link.key),
                    previous: link.label === 'Previous',
                    next: link.label === 'Next',
                  })}
                >
                  <a
                    className={clsx('page-link', {
                      'page-text': link.label === 'Previous' || link.label === 'Next',
                      'me-5': link.label === 'Previous',
                    })}
                    onClick={() => { link.page !== undefined && goToPage(link.page) }}
                    style={{ cursor: 'pointer' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ListPagination;
