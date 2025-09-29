'use server'

import { getPayload } from 'payload'
import config from '@payload-config'


export async function getStudents() {
  const payload = await getPayload({ config })
  return await payload.find( { collection: 'users' } );
}
