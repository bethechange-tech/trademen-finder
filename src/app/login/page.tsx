import dynamic from 'next/dynamic'

const HankoAuth = dynamic(() => import('@/components/hanko/HankoAuth'), { ssr: true })

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {

  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <HankoAuth page={params?.page === 'undefined' ? '' : params.page} />
    </div>
  )
}
