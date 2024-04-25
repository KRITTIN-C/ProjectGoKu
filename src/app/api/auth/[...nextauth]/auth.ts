import NextAuth, { SessionStrategy, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import {DynamoDB, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
// import {DynamoDBDocument , GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
// import {DynamoDBAdapter} from "@auth/dynamodb-adapter";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


// interface User {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   role: string;
// }

// const users: User[] = [
//   { id: "1", name: 'ART', email: 'art@email.com', password: '1', role: 'admin' },
//   { id: "2", name: 'LINN', email: 'linn@email.com', password: '2', role: 'member' },
//   { id: "3", name: 'PORN', email: 'porn@email.com', password: '3', role: 'member' },
// ];

// Set the correct AWS region
AWS.config.update({
  region: process.env.DYNAMODB_ACCESS_REGION_ID, // Replace with your AWS region
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMODB_ACCESS_SECRET_ID,
});

// Create a DynamoDB instance
const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint("http://localhost:8000") });

async function checkDuplicateEmail(email: string) {
  const params = {
    TableName: 'Users',
    IndexName: 'EmailIndex', // Assuming you have an index on the 'email' attribute
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: { '#email': 'email' },
    ExpressionAttributeValues: { ':email': { S: email } }
  };
 
  try {
    const data = await dynamodb.query(params).promise();
    console.log("try data", data);
  } catch (err) { 
    console.error("Error datas", err);
    return false; // Return false on error or if email not found
  } 
  // const params = {
  //   TableName: 'Users',
  //   KeySchema: [
  //     { AttributeName: 'UserID', KeyType: 'HASH' },  // Partition key
  //   ],
  //   AttributeDefinitions: [
  //     { AttributeName: 'UserID', AttributeType: 'S' },  // UserID is of type String
  //     { AttributeName: 'Email', AttributeType: 'S' }    // Email is of type String
  //   ],
  //   ProvisionedThroughput: {
  //     ReadCapacityUnits: 5,
  //     WriteCapacityUnits: 5
  //   },
  //   GlobalSecondaryIndexes: [
  //     {
  //       IndexName: 'EmailIndex', // Index Name
  //       KeySchema: [
  //         { AttributeName: 'Email', KeyType: 'HASH' }  // Partition key for the index
  //       ],
  //       Projection: {
  //         ProjectionType: 'ALL' // You can specify what attributes to project into the index
  //       },
  //       ProvisionedThroughput: {
  //         ReadCapacityUnits: 5,
  //         WriteCapacityUnits: 5
  //       }
  //     }
  //   ]
  // };
  
  // dynamodb.createTable(params, function(err, data) {
  //   if (err) {
  //     console.error("Error creating table:", err);
  //   } else {
  //     console.log("Table created successfully:", data);
  //   }
  // });
} 

// Function to create a new user 
export const createNewUser = async ( name: string, email: string, passwordInput: string, role: string) => {
  const userId = uuidv4(); // Generates a UUID


// console.log("userId",userId)
  const params: AWS.DynamoDB.PutItemInput = {
    TableName: "User",
    Item: {
      "user_uuid": { S: userId },
      "name": { S: name },
      "email": { S: email },
      "password": { S: passwordInput },
      "role": { S: role },
      "create_at": { S: new Date().toISOString() },
      "update_at": { S: new Date().toISOString() },
      // Add other required attributes here
    }
  }; 

  try {
    const check_email = await checkDuplicateEmail(email)
    console.log("check_emailhaha",check_email)
    // if(check_email){
    //   console.log("This Email used to")
    // }
    // else{
    //   const response = await dynamodb.putItem(params).promise();
    //   console.log("responseDB", response);
    //   return response;
    // }
    // const response = await dynamodb.putItem(params).promise();
    // console.log("responseDB", response);
    // return response;
  } catch (error) {
    console.log("error kuy rai",error)
    throw error;
  }
}
// console.log("asdfgh")
createNewUser("testadmin1","admin1@email.com","1234","admin");

// Function to delete a user
export const deleteUser = async (userId: number) => {
  const params: AWS.DynamoDB.DeleteItemInput = {
    TableName: "User",
    Key: {
      "user_id": { N: userId.toString() },
    }
  };

  try {
    const response = await dynamodb.deleteItem(params).promise();
    console.log("User deleted successfully");
    return response;
  } catch (error) {
    throw error;
  }
}

export const getUserById = async (userId: number) => {
  const params: AWS.DynamoDB.GetItemInput = {
    TableName: "User",
    Key: {
      "user_id": { N: userId.toString() },
    }
  };

  try {
    const response = await dynamodb.getItem(params).promise();
    if (!response.Item) {
      throw new Error(`User with userId ${userId} not found`);
    }
    const user = AWS.DynamoDB.Converter.unmarshall(response.Item);

    const groupParams: AWS.DynamoDB.QueryInput = {
      TableName: "User_group",
      KeyConditionExpression: "group_id = :id",
      ExpressionAttributeValues: {
        ":id": { N: user.group_id.toString() }
      }
    };

    const groupResponse = await dynamodb.query(groupParams).promise();
    if (!groupResponse.Items || groupResponse.Items.length === 0) {
      throw new Error(`Group with groupId ${user.group_id} not found`);
    }

    const group = AWS.DynamoDB.Converter.unmarshall(groupResponse.Items[0]);
    user.group = group; // Add group details to the user object
    console.log("User group_id:", user.group_id);
    return user;
  } catch (error) {
    throw error;
  }
}
getUserById(3)
// deleteUser(1)
// const config: DynamoDBClientConfig = {
//   credentials: {
//     accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.DYNAMODB_ACCESS_SECRET_ID as string,
//   },
//   region: process.env.DYNAMODB_ACCESS_REGION_ID,
//   endpoint: "http://localhost:8000", 
// }

// const client = DynamoDBDocument.from(new DynamoDB(config))

// export const createNewUser = async (userId: number, name: string, Email: string, PasswordInput:string) => {
//   const command = new PutCommand({
//      TableName: "User",
//      Item: {
//         user_id: userId,
//         name: name,
//         email: Email,
//         password: PasswordInput,
//      },
//   })
//   try { 
//      const response = await client.send(command);
//      console.log("responseDB",response);
//      return response
//   } catch (error) {
//    throw error
//   }
// }

// export const getForUser = async(userId: number) => {
//   const command = new GetCommand({
//       TableName: "User",
//       Key: {
//         userId: userId
//       }
//   })

// try {
//     const response = await client.send(command);
//     console.log("get user sus kuy",response)

//  } catch (error) {
//     throw error
//  }

// }

// createNewUser(1,"art",credentials.email,credentials.password,1)

const getUserByEmailAndPassword = async (email: string, password: string) => {
  const params: AWS.DynamoDB.GetItemInput = {
    TableName: "User",
    Key: {
      "email": { S: email },
    },
  };

  try {
    const { Item } = await dynamodb.getItem(params).promise();
    if (!Item || Item.password.S !== password) {
      return null; // หากไม่พบผู้ใช้ หรือรหัสผ่านไม่ตรงกัน ให้ return null
    }
    return AWS.DynamoDB.Converter.unmarshall(Item); // หากพบผู้ใช้และรหัสผ่านตรงกัน ให้ return ข้อมูลผู้ใช้
  } catch (error) {
    console.error('Error fetching user from DynamoDB:', error);
    throw new Error('Failed to fetch user');
  }
};

export const authOptions: any = {
  // adapter: DynamoDBAdapter(client),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'art@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        console.log("credentials", credentials)

        // const user = await users.find((u) => u.email === credentials.email && u.password === credentials.password);
        try {
          const user = await getUserByEmailAndPassword(credentials.email, credentials.password);
          if (!user) {
            return null; // หากไม่พบผู้ใช้ ให้ return null
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Error authorizing user:', error);
          throw new Error('Failed to authorize user');
        }
      },
    })
  ],
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    jwt: async ({ token, user }: { token: any, user: any }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log("token.id,user.id", token.id, user.id);
      }
      return token;
    },
    session: async ({ session, token }: { session: any, token: any }) => {
      if (session && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        console.log("token.id,session.user.id", token.id, session.user.id);
      }
      console.log("Session data:", session);
      return session;
    }
  },
}

export const AppGetServerSession = () => getServerSession(authOptions);

export default NextAuth(authOptions);