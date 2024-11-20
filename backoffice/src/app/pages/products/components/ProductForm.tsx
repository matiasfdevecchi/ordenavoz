import React, { FC, useMemo } from 'react';
import { Formik, Field, ErrorMessage, FieldArray, FormikHelpers, Form } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import { KTIcon } from '../../../../_metronic/helpers/components/KTIcon';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useGetCategories } from '../../../../api/categories';
import { useGetIngredients } from '../../../../api/ingredients';
import { useNotifier } from '../../../../hooks/useNotifier';
import IngredientsTable from './IngredientsTable';
import { CreateProductProps } from '../../../../api/products/_queries';

const validationSchema = Yup.object({
    productName: Yup.string().required('Nombre es requerido'),
    categoryId: Yup.number().required('Categoría es requerida').typeError('Categoría es requerida'),
    price: Yup.number().required('Precio es requerido').positive('El precio debe ser positivo').typeError('El precio debe ser un número'),
    image: Yup.mixed().required('Imagen es requerida'),
    ingredients: Yup.array().of(
        Yup.object().shape({
            ingredientId: Yup.number().required('Ingrediente es requerido').typeError('Ingrediente es requerido'),
            quantity: Yup.number().required('Cantidad es requerida').positive('La cantidad debe ser positiva').typeError('La cantidad debe ser un número'),
        })
    ),
});

const defaultInitialValues = {
    productName: '',
    categoryId: null as number | null,
    price: '',
    image: undefined as File | undefined,
    ingredients: [] as { ingredientId: number, quantity: number }[],
    selectedIngredient: undefined,
};

type Props = {
    initialValues?: typeof defaultInitialValues;
    onSubmit: (values: CreateProductProps) => Promise<void>;
}

const ProductForm: FC<Props> = ({ initialValues = defaultInitialValues, onSubmit }) => {
    const { notifyError } = useNotifier();
    const navigate = useNavigate();

    const { data: categories } = useGetCategories();
    const { data: ingredients } = useGetIngredients();

    const categoriesOptions = useMemo(() => categories?.map(category => ({ value: category.id, label: category.name })) || [], [categories]);
    const ingredientsOptions = useMemo(() => ingredients?.map(ingredient => ({ value: ingredient.id, label: ingredient.name })) || [], [ingredients]);

    const blankImg = toAbsoluteUrl('media/svg/files/blank-image.svg');

    const handleSubmit = async (values: typeof defaultInitialValues, { setSubmitting }: FormikHelpers<typeof defaultInitialValues>) => {
        setSubmitting(true)
        try {
            const categoryId = values.categoryId;
            if (!categoryId) {
                notifyError('Categoría es requerida');
                return;
            }
            await onSubmit({
                category: { id: categoryId },
                name: values.productName,
                price: parseFloat(values.price),
                image: values.image!,
                ingredients: values.ingredients.map(ingredient => ({
                    ingredient: { id: ingredient.ingredientId },
                    quantity: ingredient.quantity,
                })),
            });
            navigate('/products');
        } catch (ex) {
            console.error(ex)
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values, isSubmitting, isValid, touched }) => {
                const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.currentTarget.files && event.currentTarget.files[0]) {
                        const file = event.currentTarget.files[0];
                        setFieldValue('image', file);
                    }
                };

                const handleUpdateQuantity = (ingredientId: number, quantity: number) => {
                    const updatedIngredients = values.ingredients.map((ingredient) =>
                        ingredient.ingredientId === ingredientId ? { ...ingredient, quantity } : ingredient
                    );
                    setFieldValue('ingredients', updatedIngredients);
                };

                const userAvatarImg = useMemo(() => values.image ? URL.createObjectURL(values.image) : blankImg, [values.image, blankImg]);

                return (
                    <Form id="kt_ecommerce_add_product_form" className="form d-flex flex-column flex-lg-row" placeholder=''>
                        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
                            {/* Thumbnail */}
                            <div className="card card-flush py-4">
                                <div className="card-header">
                                    <div className="card-title">
                                        <h2>Imagen</h2>
                                    </div>
                                </div>
                                <div className="card-body text-center pt-0">
                                    <div className="image-input image-input-empty image-input-outline image-input-placeholder mb-3">
                                        <div className="image-input-wrapper w-150px h-150px" style={{ backgroundImage: `url('${userAvatarImg}')` }}></div>
                                        <label className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" aria-label="Change avatar" data-bs-original-title="Change avatar" data-kt-initialized="1">
                                            <i className="bi bi-pencil-fill fs-7"></i>
                                            <input type="file" name="image" accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
                                            <input type="hidden" name="avatar_remove" />
                                        </label>
                                    </div>
                                    <div className="text-muted fs-7">Set the product thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted</div>
                                    <ErrorMessage name="image" component="div" className="text-danger" />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="kt_ecommerce_add_product_general">
                                    <div className="d-flex flex-column gap-7 gap-lg-10">
                                        {/* General Options */}
                                        <div className="card card-flush py-4">
                                            <div className="card-header">
                                                <div className="card-title">
                                                    <h2>General</h2>
                                                </div>
                                            </div>
                                            <div className="card-body pt-0">
                                                <div className="mb-10 fv-row">
                                                    <label className="required form-label">Nombre</label>
                                                    <Field
                                                        type="text"
                                                        name="productName"
                                                        className="form-control mb-2"
                                                        placeholder="Nombre"
                                                    />
                                                    <ErrorMessage name="productName" component="div" className="text-danger" />
                                                </div>
                                                <div className="mb-10 fv-row">
                                                    <label className="required form-label">Categoría</label>
                                                    {
                                                        categories && <Select
                                                            options={categoriesOptions}
                                                            className="w-100"
                                                            placeholder="Selecciona una categoría"
                                                            onChange={option => setFieldValue('categoryId', option ? option.value : null)}
                                                        />
                                                    }
                                                    <ErrorMessage name="categoryId" component="div" className="text-danger" />
                                                </div>
                                                <div className="mb-10 fv-row">
                                                    <label className="required form-label">Precio</label>
                                                    <Field
                                                        type="text"
                                                        name="price"
                                                        className="form-control mb-2"
                                                        placeholder="Precio"
                                                    />
                                                    <ErrorMessage name="price" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Media */}
                                        <div className="card card-flush py-4">
                                            <div className="card-header">
                                                <div className="card-title">
                                                    <h2>Ingredientes</h2>
                                                </div>
                                            </div>
                                            <div className="card-body pt-0">
                                                <FieldArray name="ingredients">
                                                    {({ push, remove, replace }) => (
                                                        <>
                                                            <div className="mb-10 fv-row d-flex align-items-center">
                                                                <Select
                                                                    options={ingredientsOptions}
                                                                    className="w-100"
                                                                    placeholder="Selecciona un ingrediente"
                                                                    onChange={option => setFieldValue('selectedIngredient', option ? option.value : null)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className='btn btn-light-primary p-2'
                                                                    style={{ marginLeft: '8px' }}
                                                                    onClick={() => {
                                                                        if (values.selectedIngredient) {
                                                                            if (values.ingredients.some(ingredient => ingredient.ingredientId === values.selectedIngredient)) {
                                                                                const index = values.ingredients.findIndex(ingredient => ingredient.ingredientId === values.selectedIngredient);
                                                                                replace(index, { ingredientId: values.selectedIngredient, quantity: values.ingredients[index].quantity + 1 });
                                                                            } else {
                                                                                push({ ingredientId: values.selectedIngredient, quantity: 1 });
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <KTIcon iconName='plus' className='fs-2 p-0' />
                                                                </button>
                                                            </div>
                                                            <IngredientsTable
                                                                ingredients={values.ingredients.map(ingredient => ({
                                                                    ingredient: ingredients?.find(option => option.id === ingredient.ingredientId) || { id: ingredient.ingredientId, name: 'Unknown', image: '' },
                                                                    quantity: ingredient.quantity,
                                                                }))}
                                                                onUpdateQuantity={handleUpdateQuantity}
                                                                onDelete={(index: number) => remove(index)}
                                                            />
                                                        </>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <Link to="/products" id="kt_ecommerce_add_product_cancel" className="btn btn-light me-5">
                                    Cancelar
                                </Link>
                                <button type="submit" id="kt_ecommerce_add_product_submit" className="btn btn-primary" disabled={isSubmitting || !isValid || !touched}>
                                    <span className="indicator-label">{initialValues.productName !== '' ? 'Editar' : 'Crear'}</span>
                                    {
                                        isSubmitting && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    }
                                </button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default ProductForm;
