import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Programs: CollectionConfig = {
  slug: 'programs',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text'
    },

  ]
}
