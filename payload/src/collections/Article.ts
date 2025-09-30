import { CollectionConfig } from "payload";

export const Article: CollectionConfig = {
  slug: 'article',
  auth: false,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    }
  ]
}
