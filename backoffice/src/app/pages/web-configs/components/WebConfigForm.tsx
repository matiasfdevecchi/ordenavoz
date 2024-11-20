import { FC } from 'react';
import { useUpdateWebConfig } from '../../../../api/web-configs';
import { WebConfig } from '../../../../api/web-configs/WebConfig';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import { useNotifier } from '../../../../hooks/useNotifier';

const schema = Yup.object().shape({
    backofficePrinterUrl: Yup.string().required('Este campo es requerido'),
    clientPrinterUrl: Yup.string().required('Este campo es requerido'),
});

type WebConfigProps = {
    backofficePrinterUrl: string;
    clientPrinterUrl: string;
}

type Props = {
    webConfig: WebConfig;
}

const WebConfigForm: FC<Props> = ({ webConfig }) => {
    const action = useUpdateWebConfig();
    const { notifySuccess } = useNotifier();

    return (
        <Formik
            initialValues={{
                backofficePrinterUrl: webConfig.backofficePrinterUrl,
                clientPrinterUrl: webConfig.clientPrinterUrl,
            }}
            enableReinitialize
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                try {
                    await action.mutateAsync(values);
                    notifySuccess('Configuración actualizada correctamente');
                } catch (ex) {
                    console.error(ex);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ setFieldValue, values, isSubmitting, isValid }) => {
                return <Form placeholder=''>
                    <div className='row align-items-center mb-3'>
                        <div className='col-12 col-md-6'>
                            <label className="required form-label">URL de impresora de Backoffice</label>
                            <Field
                                type="text"
                                name="backofficePrinterUrl"
                                className="form-control mb-2"
                                placeholder="Nombre"
                            />
                            <ErrorMessage name="backofficePrinterUrl" component="div" className="text-danger" />
                        </div>
                        <div className='col-12 col-md-6'>
                            <label className="required form-label">URL de impresora de Cliente</label>
                            <Field
                                type="text"
                                name="clientPrinterUrl"
                                className="form-control mb-2"
                                placeholder="Nombre"
                            />
                            <ErrorMessage name="clientPrinterUrl" component="div" className="text-danger" />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" id="kt_ecommerce_add_product_submit" className="btn btn-primary" disabled={!isValid || isSubmitting}>
                            <span className="indicator-label">Actualizar</span>
                            {
                                isSubmitting && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            }
                        </button>
                    </div>
                </Form>
            }}
        </Formik>
    );
};

export default WebConfigForm;
