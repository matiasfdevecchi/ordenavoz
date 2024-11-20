import { FC, useEffect, useState } from "react";
import { Ingredient } from "../../../../api/ingredients/Ingredient";
import { urlToFile } from "../../../../utils/imageUtils";
import CreateIngredientModal from "./create/CreateIngredientModal";

type Props = {
    ingredient: Ingredient;
    onClose: () => void;
    onEdit: (values: { name: string, image: File }) => Promise<void>;
}

const EditIngredientModal: FC<Props> = ({ ingredient, onClose, onEdit }) => {
    const [image, setImage] = useState<File>();

    useEffect(() => {
        const fetchImage = async () => {
            const image = await urlToFile(ingredient.image);
            setImage(image);
        }
        fetchImage();
    }, [ingredient]);

    if (!image) {
        return null;
    }

    return <CreateIngredientModal
        initialValues={{
            name: ingredient.name,
            image: image,
        }}
        onClose={onClose}
        onConfirm={onEdit}
    />
}

export default EditIngredientModal;