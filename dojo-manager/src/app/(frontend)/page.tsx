'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Home } from '@/Home/Component';

const payload = await getPayload({ config })


export default async function Page() {
  return (
    <div className={'container'}>
      <Home />
    </div>
  );
}
