import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Belts: CollectionConfig = {
  slug: 'belts',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['level'],
    useAsTitle: 'level',
  },
  fields: [
    {
      name: 'level',
      type: 'text'
    },

  ]

}
