'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

const payload = await getPayload({ config });


export async function getClassSectionsByWeek()  {
  const sections = await payload.find({
    collection: 'classes'
  });

  return sections.docs;
}
