import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialUsers = [
  // Main Admin
  {
    _id: new ObjectId('000000000000000000000000'),
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'peter.parker@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000000'), // Admin
    supervisedEmployees: [
      new ObjectId('000000000000000000000001'),
      new ObjectId('000000000000000000000002'),
      new ObjectId('000000000000000000000003'),
      new ObjectId('000000000000000000000004'),
      new ObjectId('000000000000000000000005'),
      new ObjectId('000000000000000000000006'),
    ],
    phone: '(+54) 9 1176806956',
    bornDate: new Date(1970, 4, 29),
    isActive: true,
    position: new ObjectId('000000000000000000000000'),
    positionLevel: null,
    __v: 0,
  },
  // ** HEADS OF DEPARTMENT **
  //Recruitment
  {
    _id: new ObjectId('000000000000000000000001'),
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000010')],
    phone: '(+54) 9 1176801234',
    bornDate: new Date(1985, 1, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  //Organizational Development
  {
    _id: new ObjectId('000000000000000000000002'),
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000013')],
    phone: '(+54) 9 1176805678',
    bornDate: new Date(1990, 6, 22),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  //Software Development
  {
    _id: new ObjectId('000000000000000000000003'),
    firstName: 'Charlie',
    lastName: 'Davis',
    email: 'charlie.davis@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000017')],
    phone: '(+54) 9 1176809876',
    bornDate: new Date(1988, 11, 30),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  //Infrastructure
  {
    _id: new ObjectId('000000000000000000000004'),
    firstName: 'Diana',
    lastName: 'Moore',
    email: 'diana.moore@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000019'),
      new ObjectId('000000000000000000000020'),
    ],
    phone: '(+54) 9 1176806543',
    bornDate: new Date(1995, 3, 10),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  //Technical Support
  {
    _id: new ObjectId('000000000000000000000005'),
    firstName: 'Eva',
    lastName: 'White',
    email: 'eva.white@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000023')],
    phone: '(+54) 9 1176805432',
    bornDate: new Date(1982, 8, 25),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  //Customer Service
  {
    _id: new ObjectId('000000000000000000000006'),
    firstName: 'Frank',
    lastName: 'Taylor',
    email: 'frank.taylor@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000026')],
    phone: '(+54) 9 1176804321',
    bornDate: new Date(1993, 2, 5),
    isActive: true,
    position: new ObjectId('000000000000000000000001'),
    positionLevel: null,
    __v: 0,
  },
  // ** EMPLOYEES **
  {
    _id: new ObjectId('000000000000000000000009'),
    firstName: 'Charlie',
    lastName: 'Dafoe',
    email: 'charlie.dafoe@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176809876',
    bornDate: new Date(1988, 11, 30),
    isActive: true,
    position: new ObjectId('000000000000000000000003'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000010'),
    firstName: 'Lionel',
    lastName: 'Messi',
    email: 'lionel.messi@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000009')],
    phone: '(+54) 9 1176806543',
    bornDate: new Date(1995, 4, 10),
    isActive: true,
    position: new ObjectId('000000000000000000000004'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000011'),
    firstName: 'Joe',
    lastName: 'Texas',
    email: 'joe.texas@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176805432',
    bornDate: new Date(1982, 8, 25),
    isActive: true,
    position: new ObjectId('000000000000000000000005'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000012'),
    firstName: 'Susan',
    lastName: 'Williams',
    email: 'susan.williams@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000029')],
    phone: '(+54) 9 1176804321',
    bornDate: new Date(1993, 2, 5),
    isActive: true,
    position: new ObjectId('000000000000000000000006'),
    positionLevel: 'SSR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000029'),
    firstName: 'Lily',
    lastName: 'Smith',
    email: 'lily.smith@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804324',
    bornDate: new Date(1996, 6, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000006'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000013'),
    firstName: 'Grace',
    lastName: 'Lee',
    email: 'grace.lee@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000011'),
      new ObjectId('000000000000000000000012'),
    ],
    phone: '(+54) 9 1176809871',
    bornDate: new Date(1991, 5, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000007'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000014'),
    firstName: 'Henry',
    lastName: 'Martinez',
    email: 'henry.martinez@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804322',
    bornDate: new Date(1989, 3, 10),
    isActive: true,
    position: new ObjectId('000000000000000000000008'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000027'),
    firstName: 'Daniel',
    lastName: 'Schneider',
    email: 'daniel.schneider@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1187806323',
    bornDate: new Date(1999, 5, 8),
    isActive: true,
    position: new ObjectId('000000000000000000000008'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000015'),
    firstName: 'Isla',
    lastName: 'Hernandez',
    email: 'isla.hernandez@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000028')],
    phone: '(+54) 9 1176804323',
    bornDate: new Date(1994, 7, 20),
    isActive: true,
    position: new ObjectId('000000000000000000000008'),
    positionLevel: 'SSR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000028'),
    firstName: 'Sofia',
    lastName: 'Gonzalez',
    email: 'sofia.gonzalez@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1187806324',
    bornDate: new Date(1997, 11, 1),
    isActive: true,
    position: new ObjectId('000000000000000000000008'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000016'),
    firstName: 'Jack',
    lastName: 'Lopez',
    email: 'jack.lopez@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000015'),
      new ObjectId('000000000000000000000014'),
      new ObjectId('000000000000000000000027'),
    ],
    phone: '(+54) 9 1176804324',
    bornDate: new Date(1987, 2, 14),
    isActive: true,
    position: new ObjectId('000000000000000000000008'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000017'),
    firstName: 'Liam',
    lastName: 'Garcia',
    email: 'liam.garcia@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000016')],
    phone: '(+54) 9 1176804325',
    bornDate: new Date(1996, 9, 8),
    isActive: true,
    position: new ObjectId('000000000000000000000011'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000018'),
    firstName: 'Mia',
    lastName: 'Wilson',
    email: 'mia.wilson@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804326',
    bornDate: new Date(1990, 6, 12),
    isActive: true,
    position: new ObjectId('000000000000000000000012'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000019'),
    firstName: 'Noah',
    lastName: 'Brown',
    email: 'noah.brown@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [new ObjectId('000000000000000000000018')],
    phone: '(+54) 9 1176804327',
    bornDate: new Date(1985, 8, 28),
    isActive: true,
    position: new ObjectId('000000000000000000000013'),
    positionLevel: 'SSR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000020'),
    firstName: 'Olivia',
    lastName: 'Jones',
    email: 'olivia.jones@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804328',
    bornDate: new Date(1984, 1, 5),
    isActive: true,
    position: new ObjectId('000000000000000000000014'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000021'),
    firstName: 'Peter',
    lastName: 'Garcia',
    email: 'peter.garcia@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804329',
    bornDate: new Date(1992, 12, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000015'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000022'),
    firstName: 'Martin',
    lastName: 'Gomez',
    email: 'martin.gomez@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176801234',
    bornDate: new Date(1990, 1, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000016'),
    positionLevel: 'SSR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000023'),
    firstName: 'Quinn',
    lastName: 'Roberts',
    email: 'quinn.roberts@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000022'),
      new ObjectId('000000000000000000000021'),
    ],
    phone: '(+54) 9 1176804320',
    bornDate: new Date(1986, 4, 18),
    isActive: true,
    position: new ObjectId('000000000000000000000017'),
    positionLevel: 'SR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000024'),
    firstName: 'Sophia',
    lastName: 'Clark',
    email: 'sophia.clark@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804321',
    bornDate: new Date(1995, 11, 3),
    isActive: true,
    position: new ObjectId('000000000000000000000018'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000025'),
    firstName: 'Lucas',
    lastName: 'Hill',
    email: 'lucas.hill@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000030'),
      new ObjectId('000000000000000000000031'),
    ],
    phone: '(+54) 9 1176804322',
    bornDate: new Date(1991, 9, 22),
    isActive: true,
    position: new ObjectId('000000000000000000000019'),
    positionLevel: 'SSR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000030'),
    firstName: 'Luna',
    lastName: 'Petersen',
    email: 'luna.petersen@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176804324',
    bornDate: new Date(1991, 10, 22),
    isActive: true,
    position: new ObjectId('000000000000000000000019'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000031'),
    firstName: 'Ethan',
    lastName: 'Johnson',
    email: 'ethan.johnson@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [],
    phone: '(+54) 9 1176809999',
    bornDate: new Date(1992, 5, 15),
    isActive: true,
    position: new ObjectId('000000000000000000000019'),
    positionLevel: 'JR',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000026'),
    firstName: 'Emma',
    lastName: 'Adams',
    email: 'emma.adams@company.com',
    password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
    role: new ObjectId('000000000000000000000001'), // Client
    supervisedEmployees: [
      new ObjectId('000000000000000000000024'),
      new ObjectId('000000000000000000000025'),
    ],
    phone: '(+54) 9 1176804323',
    bornDate: new Date(1994, 6, 14),
    isActive: true,
    position: new ObjectId('000000000000000000000020'),
    positionLevel: 'SR',
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
