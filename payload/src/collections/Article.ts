import { CollectionConfig } from "payload";

// Esta colección se mantiene para compatibilidad, pero los posts principales están en Posts.ts
export const Article: CollectionConfig = {
  slug: 'article',
  auth: false,
  admin: {
    hidden: true, // Ocultar del admin panel ya que usaremos Posts
  },
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
