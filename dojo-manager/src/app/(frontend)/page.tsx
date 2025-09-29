'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import PageClient from "@/app/(frontend)/page.client";


const payload = await getPayload({ config })
const students = await payload.find({ collection: 'users' })


export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      { students.docs.map((student) => (
        <div key={student.id}>{student.fullName}</div>
      )) }
      <PageClient />
    </div>
  );
}
