import { FC, useEffect, useState } from "react";
import { Category } from "../../../../api/categories/Category";
import { urlToFile } from "../../../../utils/imageUtils";
import CreateCategoryModal from "./create/CreateCategoryModal";

type Props = {
    category: Category;
    onClose: () => void;
    onEdit: (values: { name: string, image: File }) => Promise<void>;
}

const EditCategoryModal: FC<Props> = ({ category, onClose, onEdit }) => {
    const [image, setImage] = useState<File>();

    useEffect(() => {
        const fetchImage = async () => {
            const image = await urlToFile(category.image);
            setImage(image);
        }
        fetchImage();
    }, [category]);

    if (!image) {
        return null;
    }

    return <CreateCategoryModal
        initialValues={{
            name: category.name,
            image: image,
        }}
        onClose={onClose}
        onConfirm={onEdit}
    />
}

export default EditCategoryModal;