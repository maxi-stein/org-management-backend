import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialPositions = [
  {
    _id: new ObjectId('000000000000000000000000'),
    title: 'CEO',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    title: 'Head Of Department',
    __v: 0,
  },
  //** HR Positions **
  //Recruitment
  {
    _id: new ObjectId('000000000000000000000002'),
    title: 'Recruitment Specialist',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000003'),
    title: 'Recruiter',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000004'),
    title: 'Recruitment Manager',
    __v: 0,
  },
  //Organizational Development
  {
    _id: new ObjectId('000000000000000000000005'),
    title: 'OD Specialist',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000006'),
    title: 'Organizational Development Consultant',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000007'),
    title: 'OD Manager',
    __v: 0,
  },
  //** IT Department **
  //Software Development
  {
    _id: new ObjectId('000000000000000000000008'),
    title: 'Developer',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000009'),
    title: 'Developer',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000010'),
    title: 'Developer',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000011'),
    title: 'Tech Leader',
    __v: 0,
  },
  //Infrastructure
  {
    _id: new ObjectId('000000000000000000000012'),
    title: 'System Administrator',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000013'),
    title: 'Infrastructure Engineer',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000014'),
    title: 'Infrastructure Manager',
    __v: 0,
  },
  //Technical Support
  {
    _id: new ObjectId('000000000000000000000015'),
    title: 'Support Technician',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000016'),
    title: 'Support Specialist',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000017'),
    title: 'Support Manager',
    __v: 0,
  },
  //** Sales Department **
  //Customer Service
  {
    _id: new ObjectId('000000000000000000000018'),
    title: 'Customer Service Representative',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000019'),
    title: 'Customer Support Specialist',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000020'),
    title: 'Customer Service Manager',
    __v: 0,
  },
];

export const up = async (db) => {
  await db.collection('positions').insertMany(initialPositions);
};

export const down = async (db) => {
  await db.collection('positions').deleteMany({
    _id: {
      $in: initialPositions.map((pos) => pos._id),
    },
  });
};
