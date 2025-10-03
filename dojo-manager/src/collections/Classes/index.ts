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
      type: 'text',
      required: true
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs'
    },
    {
      name: 'section',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            {
              label: 'Monday',
              value: 'Monday'
            },
            {
              label: 'Tuesday',
              value: 'Tuesday'
            },
            {
              label: 'Wednesday',
              value: 'Wednesday'
            },
            {
              label: 'Thursday',
              value: 'Thursday'
            },
            {
              label: 'Friday',
              value: 'Friday'
            },
            {
              label: 'Saturday',
              value: 'Saturday'
            },
            {
              label: 'Sunday',
              value: 'Sunday'
            },
          ]
        },
        {
          name: 'startTime',
          type: 'date',
          hooks: {
            afterRead: [
              ({ value }) => {
                return new Date(value).toLocaleTimeString('en-US', {
                  hourCycle: "h24",
                  timeStyle: "medium"
                });
              }
            ]
          },
          admin: {
            date: {
              pickerAppearance: 'timeOnly'
            }
          }
        },
        {
          name: 'endTime',
          type: 'date',
          hooks: {
            afterRead: [
              ({ value }) => {
                return new Date(value).toLocaleTimeString('en-US', {
                  hourCycle: "h24",
                  timeStyle: "medium"
                });
              }
            ]
          },
          admin: {
            date: {
              pickerAppearance: 'timeOnly'
            }
          }
        }
      ]
    }

  ]
}
