export interface ICategory {
  name: string;
  description?: string | undefined;
  isActive: boolean;
}

export interface ICreateCategory {
  name: string;
  description?: string | undefined;
}

export interface IUpdateCategory {
  name?: string | undefined;
  description?: string | undefined;
  isActive?: boolean | undefined;
}
