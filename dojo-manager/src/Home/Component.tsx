import React from 'react'
import { getPayload } from "payload";
import config from "@/payload.config";
import { RichText} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";


const payload = await getPayload({ config });
const home = await payload.findGlobal({ slug: 'home' });


export async function Home(){
  return (
    <div>
      <RichText data={home.content as SerializedEditorState} />
    </div>
  )
}
