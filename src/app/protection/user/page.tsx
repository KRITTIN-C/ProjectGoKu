'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const { data: session, status } = useSession()

  const router = useRouter()
  console.log("session: ",session)

  return (
    status === 'authenticated' &&
    (session as any).user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p>
            Welcome, <b>{(session as any).user.name}!</b>
          </p>
          <p>Email: {(session as any).user.email}</p>
           <p>Role: {((session as any).user as any).role}</p> 
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  )
}