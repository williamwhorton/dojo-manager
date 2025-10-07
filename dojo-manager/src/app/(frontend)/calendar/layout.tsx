

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>){
  return (
    <div className="container flex flex-col gap-4">
      <h1 className={"font-semibold text-4xl ms-8"}>Calendar</h1>
      {children}
    </div>
  )
}


