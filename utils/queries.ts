const orderQuery = `
  _id,
orderItems[] {
  _key,
  image {asset {_ref}},
  name,
  price,
  quantity,
},
shippingAddress{
  address,
  city,
  country,
  fullName,
  postalCode,
},
paymentMethod,
itemsPrice,
shippingPrice,
taxPrice,
totalPrice,
isPaid,
paidAt,
isDelivered,
deliveredAt,
_createdAt,
_updatedAt,
user -> {
  _id,
name,
email,
isAdmin,
_createdAt,
_updatedAt,
},
userName,
`;

export const allProductQuery = () => {
  const query = `*[_type == "products"] | order(_createdAt desc)`;

  return query;
};

export const productDetailQuery = (slug: string | string[] | undefined) => {
  const query = `*[_type == "products" && slug.current == '${slug}'][0]`;

  return query;
};

export const singleUserEmailQuery = (email: string | string[] | undefined) => {
  const query = `*[_type == "user" && email == '${email}'][0]`;

  return query;
};

export const singleUserQuery = (userId: string | string[] | undefined) => {
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const allUsersQuery = () => {
  const query = `*[_type == "user"]`;

  return query;
};

;

export const getAllUserOrder = (userId: string | string[] | undefined) => {
  const query = `*[_type == "order" && user._ref == '${userId}']{
    ${orderQuery}
  }`;

  return query;
};

export const getOrderById = (_id: string | string[] | undefined) => {
  const query = `*[_type == "order" && _id == '${_id}'][0] {
    ${orderQuery}
  }`;

  return query;
};

export const getAllCategoriesQuery = () => {
  const query = `*[_type == "products"]{
  category
}`;

  return query;
};

export const getAllBrandQuery = () => {
  const query = `*[_type == "products"]{
  brand
}`;

  return query;
};

export const getByCategoryQuery = (category: string | string[] | undefined) => {
  const query = `*[_type == "products" && category match '${category}*']`;

  return query;
};

export const getByBrandQuery = (brand: string | string[] | undefined) => {
  const query = `*[_type == "products" && brand match '${brand}*']`;

  return query;
};
