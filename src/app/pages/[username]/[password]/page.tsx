"use client"
import { useParams } from 'next/navigation';
import React from 'react';

const SuccessPage: React.FC = () => { 

  const param = useParams();
  console.log(param);
  return (
    <div>
      <h1>Login Success</h1>
      <p>Username: {param.username}</p>
      <p>Password: {param.password}</p>
    </div>
  );
};

export default SuccessPage;
