import react from "react";
import { getPayload } from 'payload'
import config from '@payload-config'
import Calendar from "./calendar";

const payload = await getPayload({ config })

export default async function Page() {

  return (
    <div>
      <Calendar />

    </div>
  )

}
