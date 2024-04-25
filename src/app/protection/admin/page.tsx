"use server"
import React from 'react'
import { AppGetServerSession } from '@/app/api/auth/[...nextauth]/auth';
import { error } from 'console';
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await AppGetServerSession(); 
  if((session as any).user.role==='member'){
    redirect('/protection/user')
  }
  console.log("server tool",session)
  return (
    <div>DASHBOARD</div>
  )
}
