'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getClassSectionByID(id: string) {
  const payload = await getPayload({ config })

  try {
    return await payload.findByID({
      collection: 'classes',
      id,
    })
  } catch (error: any) {
    throw new Error(`Error fetching class section: ${error.message}`)
  }
}
