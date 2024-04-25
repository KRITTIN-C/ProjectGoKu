"use client"
import { Button, Container, TextInput, Box, Paper } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@css/login.css';
import { signIn } from 'next-auth/react';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { useSession } from 'next-auth/react';
// import { AppGetServerSession } from '@/app/api/auth/[...nextauth]/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    // const { data: session, status } = useSession()
    // const session = await AppGetServerSession(); 

    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      console.log("result", result)

      router.push('/protection/admin')
      // if(session && session.user && (session.user as any).role === "member") {

    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Container className="container" size="md">
      <Paper shadow="sm" style={{ padding: '16px', maxWidth: 400, margin: '0 auto' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-md shadow-md"
          >
            <h1>LOGIN</h1>
            <TextInput
              className="text-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: 10 }} />
            <TextInput
              className="text-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: 10 }} />
            <Button type='submit' className="button">Login</Button>
            {/* <Button type='submit' className="button" onClick={(event) => handleLogin(event)}>Login</Button> */}
          </form>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;