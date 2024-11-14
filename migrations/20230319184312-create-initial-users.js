import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialUsers = [
  {
    _id: new ObjectId('000000000000000000000000'),
    email: 'admin@baseapi.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Admin',
    lastName: 'BaseApi',
    role: new ObjectId('000000000000000000000000'), // Admin
    isActive: true,
    phone: '(+54) 9 1176806956',
    bornDate: new Date(1990, 4, 29),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    email: 'glarriera@gmail.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Gaston',
    lastName: 'Larriera',
    role: new ObjectId('000000000000000000000001'), // Client
    phone: '(+54) 9 1176806956',
    bornDate: new Date(1990, 4, 29),
    isActive: true,
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    email: 'clopez@gmail.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Carlos',
    lastName: 'Lopez',
    phone: '(+598) 2204 5199',
    bornDate: new Date(2000, 0, 15),
    role: new ObjectId('000000000000000000000001'), // Client
    isActive: true,
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000003'),
    email: 'jcastaño@gmail.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Julian',
    lastName: 'Castaño',
    phone: '(+54) 9 1166806956',
    bornDate: new Date(1995, 0, 15),
    role: new ObjectId('000000000000000000000001'), // Client
    isActive: true,
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000004'),
    email: 'mlopez@gmail.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Matias',
    lastName: 'Lopez',
    phone: '(+54) 9 1166806956',
    bornDate: new Date(1997, 10, 1),
    role: new ObjectId('000000000000000000000001'), // Client
    isActive: true,
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000005'),
    email: 'fsarmiento@gmail.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    firstName: 'Fernando',
    lastName: 'Sarmiento',
    phone: '(+54) 9 1166806956',
    bornDate: new Date(1999, 2, 25),
    role: new ObjectId('000000000000000000000001'), // Client
    isActive: true,
    __v: 0,
  },
];

export const up = async (db) => {
  await db.collection('users').insertMany(initialUsers);
};

export const down = async (db) => {
  await db.collection('users').deleteMany({
    _id: {
      $in: initialUsers.map((user) => user._id),
    },
  });
};
