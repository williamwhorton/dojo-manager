import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { US_STATES } from "@/constants/us-states";
import { PREFIXES, SUFFIXES } from "@/constants/name";

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'fullName',
  },
  auth: true,
  fields: [
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true, // hides the field from the admin panel
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['fullName']
          }
        ],
        afterRead: [
          ({ data }) => {
            return `${data?.name.prefix} ${data?.name.firstName} ${data?.name.lastName} ${data?.name.suffix}`;
          }
        ],
      },
    },
    {
      name: 'name',
      type: 'group',
      fields: [
        {
          name: 'prefix',
          type: 'select',
          options: PREFIXES
        },
        {
          name: 'firstName',
          type: 'text',
          required: true
        },
        {
          name: 'lastName',
          type: 'text',
          required: true
        },
        {
          name: 'suffix',
          type: 'select',
          options: SUFFIXES
        }
      ]
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'select',
          options: US_STATES
        },
        {
          name: 'zip',
          type: 'number'
        }
      ]
    },
    {
      name: 'programs',
      type: 'array',
      fields: [
        {
          name: 'program',
          type: 'relationship',
          relationTo: 'programs'
        },
        {
          name: 'belt',
          type: 'relationship',
          relationTo: 'belts'
        },
        {
          name: 'numberOfClassesAttended',
          type: 'number'
        }
      ]
    }

  ],
  timestamps: true,
}
