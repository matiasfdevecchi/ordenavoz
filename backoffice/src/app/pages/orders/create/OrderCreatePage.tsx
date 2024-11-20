import { Content } from "../../../../_metronic/layout/components/Content";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNotifier } from '../../../../hooks/useNotifier';
import { useGetCategories } from "../../../../api/categories";
import { useEffect, useMemo, useState } from "react";
import { CategoryId } from "../../../../api/categories/Category";
import { useGetProducts } from "../../../../api/products";
import { Order } from "../../../../api/orders/Order";
import { Product } from "../../../../api/products/Product";
import ItemsTable from "./components/ItemsTable";
import AddProductModal from "./components/AddProductModal";
import { useCreateOrder } from "../../../../api/orders";

const OrderCreatePage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>();
    const [openAddProduct, setOpenAddProduct] = useState<Product>();

    const createOrderAction = useCreateOrder();

    const { notifySuccess } = useNotifier();
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState<Order['items']>([]);

    const noItems = useMemo(() => {
        if (items.length === 0) return true;
        return items.every(i => i.variants.every(v => v.quantity === 0));
    }, [items]);

    const { data: categories, isLoading } = useGetCategories();
    const { data: products, isLoading: isLoadingProducts } = useGetProducts(selectedCategoryId, true);

    const addItem = (product: Product) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(i => i.product.id === product.id);

            if (existingIndex >= 0) {
                return prev.map((i, idx) => {
                    if (idx !== existingIndex) return i;

                    const noModifiedIndex = i.variants.findIndex(v => v.removedIngredients.length === 0);
                    if (noModifiedIndex >= 0) {
                        return {
                            ...i,
                            price: i.price + product.price,
                            variants: i.variants.map((v, vIdx) => {
                                if (vIdx !== noModifiedIndex) return v;
                                return {
                                    ...v,
                                    quantity: v.quantity + 1,
                                }
                            })
                        }
                    }
                    return {
                        ...i,
                        variants: [...i.variants, {
                            id: 1,
                            quantity: 1,
                            removedIngredients: [],
                        }]
                    }
                })
            }

            return [...prev, {
                product,
                price: product.price,
                variants: [
                    {
                        id: 1,
                        quantity: 1,
                        removedIngredients: [],
                    }
                ]
            }]
        });
    }

    const handleAddItem = (product: Product) => {
        if (product.ingredients.length === 0)
            addItem(product);
        else
            setOpenAddProduct(product);
    }

    useEffect(() => {
        if (selectedCategoryId) return;
        if (!categories) return;
        if (!categories.length) return;

        setSelectedCategoryId(categories[0].id);
    }, [categories]);

    const onSubmit = async () => {
        const order = await createOrderAction.mutateAsync({
            items: items.map(i => ({
                ...i,
                price: i.product.price || 0,
            })),
        })
        notifySuccess("Orden creada con éxito");
        navigate(`/orders/${order.id}/pay`, { state: location.state });
    }

    const handleRemove = (index: number, vIndex: number) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            const selectedItem = updatedItems[index];

            selectedItem.variants.splice(vIndex, 1);

            if (selectedItem.variants.length === 0) {
                updatedItems.splice(index, 1);
            } else {
                selectedItem.price = selectedItem.variants.reduce(
                    (total, variant) => total + variant.quantity * (selectedItem.product.price || 0),
                    0
                );
            }

            return updatedItems;
        });
    };

    const handleDecrease = (index: number, vIndex: number) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            const selectedItem = updatedItems[index];

            const prevQuantity = selectedItem.variants[vIndex].quantity;
            selectedItem.variants[vIndex].quantity = Math.max(0, selectedItem.variants[vIndex].quantity - 1);
            selectedItem.price += (selectedItem.variants[vIndex].quantity - prevQuantity) * (selectedItem.product.price || 0);

            return updatedItems;
        });
    };

    const handleIncrease = (index: number, vIndex: number) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            const selectedItem = updatedItems[index];

            const prevQuantity = selectedItem.variants[vIndex].quantity;
            selectedItem.variants[vIndex].quantity++;
            selectedItem.price += (selectedItem.variants[vIndex].quantity - prevQuantity) * (selectedItem.product.price || 0);

            return updatedItems;
        });
    };

    const handleAddProduct = (i: Order['items'][0]) => {
        setItems(items => [...items, i]);
    }

    return (
        <>
            {
                openAddProduct && <AddProductModal product={openAddProduct} onClose={() => setOpenAddProduct(undefined)} onAddProduct={handleAddProduct} />
            }
            <Content>
                <div className="row">
                    <div className="col-12">
                        {/* Thumbnail */}
                        <div className="card card-flush py-4">
                            <div className="card-header">
                                <div className="card-title">
                                    <h2>Productos</h2>
                                </div>
                            </div>
                            <div className="card-body text-center pt-0">
                                {isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2 m-10'></span>}
                                {!isLoading && categories && (
                                    <ul className="nav nav-tabs flex-row pb-3">
                                        {categories.map((category) => (
                                            <li key={category.id} className="nav-item mb-3 me-3 me-lg-6" role="presentation">
                                                <div
                                                    className={`nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-column overflow-hidden min-w-150px h-100px pt-5 pb-2 ${selectedCategoryId === category.id ? "border-primary" : ""}`}
                                                    id={`category_${category.id}`}
                                                    aria-selected="false"
                                                    role="tab"
                                                    tabIndex={-1}
                                                    onClick={() => setSelectedCategoryId(category.id)}
                                                >
                                                    <div className="nav-icon mb-3">
                                                        <img src={category.image} alt={category.name} className="img-fluid" style={{ maxHeight: "40px" }} />
                                                    </div>
                                                    <span className={`nav-text fw-bold fs-3 lh-1 ${selectedCategoryId === category.id ? "text-primary" : "text-gray-800"}`}>
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {isLoadingProducts && <span className='spinner-border spinner-border-sm align-middle ms-2 m-10'></span>}
                                {!isLoading && products && (
                                    <div className="mt-6 row">
                                        {products.map((product) => (
                                            <div key={product.id} className="col-4 mb-4">
                                                <div
                                                    className="nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-row overflow-hidden h-100px w-100"
                                                    id={`product_${product.id}`}
                                                    aria-selected="false"
                                                    role="tab"
                                                    tabIndex={-1}
                                                    onClick={() => handleAddItem(product)}
                                                >
                                                    <div className="nav-icon me-3">
                                                        <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: "100px", maxWidth: "100px" }} />
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-start h-100 p-4">
                                                        <span className={`nav-text fw-bold fs-3 lh-1 text-gray-800`}>
                                                            {product.name}
                                                        </span>
                                                        <span className="nav-text text-primary fw-bold fs-4">
                                                            ${product.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-8">
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="kt_ecommerce_add_product_general">
                                <div className="d-flex flex-column gap-7 gap-lg-10">
                                    {/* General Options */}
                                    <div className="card card-flush py-4">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <h2>Orden</h2>
                                            </div>
                                        </div>
                                        <div className="card-body pt-0">
                                            <ItemsTable items={items} onRemove={handleRemove} onDecrease={handleDecrease} onIncrease={handleIncrease} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-6">
                    <Link to="/orders" id="kt_ecommerce_add_product_cancel" className="btn btn-light me-5">
                        Cancelar
                    </Link>
                    <button type="submit" id="kt_ecommerce_add_product_submit" className="btn btn-primary" onClick={onSubmit} disabled={noItems}>
                        <span className="indicator-label">Crear</span>
                        {
                            createOrderAction.isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        }
                    </button>
                </div>
            </Content>
        </>
    );
}

export default OrderCreatePage;
