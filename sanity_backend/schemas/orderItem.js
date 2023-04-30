export default {
  name: 'orderItem',
  title: 'Order Item',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'quantity',
      name: 'quantity',
      type: 'number',
    },
    {
      title: 'image',
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      title: 'price',
      name: 'price',
      type: 'number',
    },
  ],
}
