import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const initialDepartments = [
  {
    _id: new ObjectId('000000000000000000000000'),
    name: 'Recruitment',
    description:
      ' Responsible for attracting, screening, and hiring new employees. This department manages job postings, conducts interviews, and collaborates with hiring managers to fill positions effectively.',
    head: new ObjectId('000000000000000000000001'),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000001'),
    name: 'Organizational Development',
    description: `Focuses on improving the organization's effectiveness through training, performance management, and leadership development. This department works on initiatives to enhance employee skills and workplace culture.`,
    head: new ObjectId('000000000000000000000002'),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000002'),
    name: 'Software Development',
    description: `Designs, builds, and maintains software applications. This department works on developing new features, fixing bugs, and ensuring the software meets user needs.`,
    head: new ObjectId('000000000000000000000003'),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000003'),
    name: 'Infrastructure',
    description: `Responsible for maintaining the IT infrastructure, including servers, networks, and databases. This department ensures system reliability, security, and scalability.`,
    head: new ObjectId('000000000000000000000004'),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000004'),
    name: 'Technical Support',
    description: `Provides assistance to employees and customers with technical issues. This department resolves problems related to software, hardware, and other IT services, ensuring smooth operations.`,
    head: new ObjectId('000000000000000000000005'),
    __v: 0,
  },
  {
    _id: new ObjectId('000000000000000000000005'),
    name: 'Customer Service',
    description: `Handles customer inquiries, complaints, and support requests. This department ensures customer satisfaction by providing timely and effective solutions to issues and fostering positive relationships.`,
    head: new ObjectId('000000000000000000000006'),
    __v: 0,
  },
];

export const up = async (db) => {
  await db.collection('departments').insertMany(initialDepartments);
};

export const down = async (db) => {
  await db.collection('departments').deleteMany({
    _id: {
      $in: initialDepartments.map((dep) => dep._id),
    },
  });
};
