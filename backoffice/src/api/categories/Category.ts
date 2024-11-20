export type CategoryId = number;

export type CategoryProps = {
  id: CategoryId;
  name: string;
  image: string;
}

export class Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly image: string;

  constructor({ id, name, image }: CategoryProps) {
    this.id = id;
    this.name = name;
    this.image = image;
  }

  static NEW_ID = 0;

  static new(props: Omit<CategoryProps, "id">): Category {
    return new Category({
      ...props,
      id: this.NEW_ID,
    });
  }

  copy(props: Partial<CategoryProps>): Category {
    return new Category({
      ...this,
      ...props,
    });
  }

  setImage(image: string): Category {
    return this.copy({ image });
  }

  static fromJson(data: CategoryProps): Category {
    return new Category(data);
  }
}