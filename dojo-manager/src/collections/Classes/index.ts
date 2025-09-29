import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Classes: CollectionConfig = {
  slug: 'classes',
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
  fields: [
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs'
    }

  ]
}
