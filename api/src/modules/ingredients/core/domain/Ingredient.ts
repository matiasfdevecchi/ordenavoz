export type IngredientId = number;

export type IngredientProps = {
  id: IngredientId;
  name: string;
  image: string;
}

export class Ingredient {
  readonly id: IngredientId;
  readonly name: string;
  readonly image: string;

  constructor({ id, name, image }: IngredientProps) {
    this.id = id;
    this.name = name;
    this.image = image;
  }

  static NEW_ID = 0;

  static new(props: Omit<IngredientProps, "id">): Ingredient {
    return new Ingredient({
      ...props,
      id: this.NEW_ID,
    });
  }

  copy(props: Partial<IngredientProps>): Ingredient {
    return new Ingredient({
      ...this,
      ...props,
    });
  }

  setImage(image: string): Ingredient {
    return this.copy({ image });
  }
}