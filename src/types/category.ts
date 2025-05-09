// export interface ICategory {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
// }

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isActive: boolean;
  parent: string | null;
  children: ICategory[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
