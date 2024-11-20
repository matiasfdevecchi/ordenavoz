import { OptionalExceptFor } from "../../../../utils/types";
import { Category } from "../../../categories/core/domain/Category";
import { Ingredient } from "../../../ingredients/core/domain/Ingredient";
import { SimplifiedProduct } from "./SimplifiedProduct";

export type ProductId = number;

export type ProductIngredient = {
  ingredient: OptionalExceptFor<Ingredient, "id">;
  quantity: number;
}

export type ProductProps = {
  id: ProductId;
  name: string;
  image: string;
  category: OptionalExceptFor<Category, "id">;
  ingredients: ProductIngredient[];
  price: number;
}

export class Product {
  readonly id: ProductId;
  readonly name: string;
  readonly image: string;
  readonly category: OptionalExceptFor<Category, "id">;
  readonly ingredients: ProductIngredient[];
  readonly price: number;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.image = props.image;
    this.category = props.category;
    this.ingredients = props.ingredients;
    this.price = props.price
  }

  static NEW_ID = 0;

  static new(props: Omit<ProductProps, "id">): Product {
    return new Product({
      ...props,
      id: this.NEW_ID,
    });
  }

  copy(props: Partial<ProductProps>): Product {
    return new Product({
      ...this,
      ...props,
    });
  }

  setImage(image: string): Product {
    return this.copy({ image });
  }

  toSimplified(): SimplifiedProduct {
    return {
      id: this.id,
      name: this.name,
      categoryName: this.category.name ?? '',
      ingredients: this.ingredients.map(ingredient => ({
        id: ingredient.ingredient.id,
        name: ingredient.ingredient.name ?? '',
        quantity: ingredient.quantity,
      })),
    };
  }
}