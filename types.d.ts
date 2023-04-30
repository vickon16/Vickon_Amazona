export type IImage = {
  asset: {
    _ref: string;
  };
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  _createdAt: string;
  _updatedAt: string;
};

export type IShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: number;
  country: string;
};

export type IProduct = {
  _type: "products";
  _rev: string;
  _createdAt: string;
  _id: string;
  _key: string;
  name: string;
  price: number;
  image: IImage;
  description: string;
  slug: { current: string };
  brand: "Casely" | "Adidas" | "Nike" | "Oliver";
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  quantity: number;
};

export type IProductState = {
  products: IProduct[] | [];
  loading: boolean;
  error: string;
};

export type IOrder = {
  _id: string;
  orderItems: IProduct[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: string;
  paidAt: string;
  isDelivered: string;
  deliveredAt: string;
  _createdAt : string;
  _updatedAt : string;
  user : IUser;
  userName : string;
};

export type IFormInputs = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type ISearchType = {
  category? : string;
  sort? : string;
  searchQuery? : string;
  price? : string;
  rating? : string;
  query? : string;
};