import { Request } from "express"
import { BadRequest } from "../../../modules/shared/domain/errors/BadRequest";
import { Pagination } from "../../../modules/shared/domain/Pagination";
import { UserRole } from "../../../modules/users/core/domain/User";
import { ProductId } from "../../../modules/products/core/domain/Product";
import { CategoryId } from "../../../modules/categories/core/domain/Category";
import { IngredientId } from "../../../modules/ingredients/core/domain/Ingredient";
import { CashierId } from "../../../modules/mercadopago/cashiers/core/domain/Cashier";
import { MpUserId } from "../../../modules/mercadopago/types";
import { OrderId } from "../../../modules/orders/core/domain/Order";

const ROLE_KEY = `${process.env.AUTH0_NAMESPACE}/role`;

export enum PathParams {
    ACCOUNT_ID = 'accountId',
    CATEGORY_ID = 'categoryId',
    CODE = 'code',
    INGREDIENT_ID = 'ingredientId',
    MOVEMENT_ID = 'movementId',
    MP_CASHIER_ID = 'mpCashierId',
    MP_DEVICE_ID = 'mpDeviceId',
    MP_PAYMENT_INTENT_ID = 'mpPaymentIntentId',
    MP_STORE_ID = 'mpStoreId',
    MP_USER_ID = 'mpUserId',
    ORDER_ID = 'orderId',
    PRODUCT_ID = 'productId',
    RECEIVING_ID = 'receivingId',
    SALE_ID = 'saleId',
    USER_ID = 'userId',
}

const getOptionalPathParam = (req: Request, param: PathParams): string | undefined => {
    return req.params[param];
}

const getPathParam = (req: Request, param: PathParams): string => {
    const value = getOptionalPathParam(req, param);
    if (!value) {
        throw new BadRequest(`${param} not found`);
    }
    return value;
}

const getIntPathParam = (req: Request, param: PathParams): number => {
    const value = getPathParam(req, param);
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
        throw new BadRequest(`${param} is not a number`);
    }
    return parsed;
}

const getOptionalIntPathParam = (req: Request, param: PathParams): number | undefined => {
    const value = getOptionalPathParam(req, param);
    if (!value) return undefined;
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
        throw new BadRequest(`${param} is not a number`);
    }
    return parsed;
}

export const getUserIdInPath = (req: Request): string => {
    return getPathParam(req, PathParams.USER_ID);
}

export const getMpCashierId = (req: Request): CashierId => {
    return getIntPathParam(req, PathParams.MP_CASHIER_ID);
}

export const getMpDeviceId = (req: Request): string => {
    return getPathParam(req, PathParams.MP_DEVICE_ID);
}

export const getMpPaymentIntentId = (req: Request): string => {
    return getPathParam(req, PathParams.MP_PAYMENT_INTENT_ID);
}

export const getMpStoreId = (req: Request): string => {
    return getPathParam(req, PathParams.MP_STORE_ID);
}

export const getMpUserId = (req: Request): MpUserId => {
    return getIntPathParam(req, PathParams.MP_USER_ID);
}

export const getAccountId = (req: Request): number => {
    return getIntPathParam(req, PathParams.ACCOUNT_ID);
}

export const getCategoryId = (req: Request): CategoryId => {
    return getIntPathParam(req, PathParams.CATEGORY_ID);
}

export const getIngredientId = (req: Request): IngredientId => {
    return getIntPathParam(req, PathParams.INGREDIENT_ID);
}

export const getCode = (req: Request): string => {
    return getPathParam(req, PathParams.CODE);
}

export const getOrderId = (req: Request): OrderId => {
    return getIntPathParam(req, PathParams.ORDER_ID);
}

export const getProductId = (req: Request): ProductId => {
    return getIntPathParam(req, PathParams.PRODUCT_ID);
}



export const getOptionalUserId = (req: Request): string | undefined => {
    return req.auth?.payload.sub;
}

export const getUserId = (req: Request): string => {
    const userId = getOptionalUserId(req);
    if (!userId) {
        throw new BadRequest('User id not found');
    }
    return userId;
}

export const getRole = (req: Request): UserRole => {
    const role = req.auth?.payload[ROLE_KEY] as UserRole | undefined;
    if (!role) {
        throw new BadRequest('Role not found');
    }
    return role;

}

export const getPage = (req: Request): number | undefined => {
    if (!req.query.page) {
        return undefined;
    }
    const page = parseInt(req.query.page as string);
    if (isNaN(page)) {
        throw new BadRequest('Invalid page');
    }
    return page;
}

export const getPageSize = (req: Request): number | undefined => {
    if (!req.query.pageSize) {
        return undefined;
    }
    const pageSize = parseInt(req.query.pageSize as string);
    if (isNaN(pageSize)) {
        throw new BadRequest('Invalid page size');
    }
    return pageSize;
}


export const getPagination = (req: Request): Pagination => {
    return Pagination.default({
        page: getPage(req),
        pageSize: getPageSize(req)
    });
}

export const getOptionalImages = (req: Express.Request, fieldname: string): (Express.Multer.File[]) | undefined => {
    const uploadedImages = req.files;
    if (!uploadedImages || uploadedImages.length === 0) return undefined;
    const images = (uploadedImages as Express.Multer.File[]).filter((file: Express.Multer.File) => file.fieldname === fieldname);
    if (images.length === 0) return undefined;
    return images;
}

export const getImages = (req: Express.Request, fieldname: string): Express.Multer.File[] => {
    return getOptionalImages(req, fieldname) ?? [];
}