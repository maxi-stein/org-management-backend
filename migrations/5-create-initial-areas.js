import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialAreas = [
  {
    _id: new ObjectId('000000000000000000000000'),
    name: 'Human Resources',
    departments: ['000000000000000000000000', '000000000000000000000001'],
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    name: 'IT',
    departments: [
      '000000000000000000000002',
      '000000000000000000000003',
      '000000000000000000000004',
    ],
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    name: 'Sales',
    departments: ['000000000000000000000005'],
    __v: 0,
  },
];

export const up = async (db) => {
  await db.collection('areas').insertMany(initialAreas);
};

export const down = async (db) => {
  await db.collection('areas').deleteMany({
    _id: {
      $in: initialAreas.map((area) => area._id),
    },
  });
};
