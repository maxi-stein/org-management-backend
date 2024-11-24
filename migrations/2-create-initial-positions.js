import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialPositions = [
  {
    _id: new ObjectId('000000000000000000000001'),
    title: 'Head of Department',
    level: null,
    __v: 0,
  },
  //** HR Positions **
  //Recruitment
  {
    _id: new ObjectId('000000000000000000000002'),
    title: 'Recruitment Specialist',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000003'),
    title: 'Senior Recruiter',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000004'),
    title: 'Recruitment Manager',
    level: 'Senior-Level',
    __v: 0,
  },
  //Organizational Development
  {
    _id: new ObjectId('000000000000000000000005'),
    title: 'OD Specialist',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000006'),
    title: 'Organizational Development Consultant',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000007'),
    title: 'OD Manager',
    level: 'Senior-Level',
    __v: 0,
  },
  //** IT Department **
  //Software Development
  {
    _id: new ObjectId('000000000000000000000008'),
    title: 'Junior Developer',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000009'),
    title: 'Developer',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000010'),
    title: 'Senior Developer',
    level: 'Senior-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000011'),
    title: 'Tech Leader',
    level: 'Senior-Level',
    __v: 0,
  },
  //Infrastructure
  {
    _id: new ObjectId('000000000000000000000012'),
    title: 'System Administrator',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000013'),
    title: 'Infrastructure Engineer',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000014'),
    title: 'Infrastructure Manager',
    level: 'Senior-Level',
    __v: 0,
  },
  //Technical Support
  {
    _id: new ObjectId('000000000000000000000015'),
    title: 'Support Technician',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000016'),
    title: 'Support Specialist',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000017'),
    title: 'Support Manager',
    level: 'Senior-Level',
    __v: 0,
  },
  //** Sales Department **
  //Customer Service
  {
    _id: new ObjectId('000000000000000000000018'),
    title: 'Customer Service Representative',
    level: 'Entry-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000019'),
    title: 'Customer Support Specialist',
    level: 'Mid-Level',
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000020'),
    title: 'Customer Service Manager',
    level: 'Senior-Level',
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