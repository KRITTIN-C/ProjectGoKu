"use server"

interface User {
  username: string;
  password: string;
}

const users: User[] = [
  { username: '1', password: '1' },
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // Add more user
];

// export const authenticateUser = (req: NextApiRequest, res: NextApiResponse) => {
//   console.log("req",req);

// }
export const authenticateUser = (username: string, password: string): boolean => {
  const user = users.find((u) => u.username === username && u.password === password);
  console.log("find user",user)
  return !!user;
};

export async function GET() {
  return Response.json({
    message: `GET method called`,
  });
}


export async function POST() {
  return Response.json({
    message: `POST method called`,
  });
}


export async function PUT() {
  return Response.json({
    message: `PUT method called`,
  });
}


export async function DELETE() {
  return Response.json({
    message: `DELETE method called`,
  });
}