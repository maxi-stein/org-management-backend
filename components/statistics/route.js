import { Router } from 'express';
import { throwError } from '../../utils/helpers.js';
import { populateSupervisedEmployees } from '../user/route.js';

export const statsRouter = new Router();
statsRouter.get('/departments-people', getDeptPeople);

async function getDeptPeople(req, res, next) {
  req.logger.info('getDeptPeople');

  try {
    //get departments
    const departments = await req
      .model('Department')
      .find()
      .select('name head');

    //get head of departments
    const people = await req
      .model('User')
      .find()
      .populate({
        path: 'position',
        match: { title: { $regex: /Head Of Department/ } },
      });

    const headOfDepartments = people.filter((p) => {
      return p.position !== null;
    });

    //populate supervised employees for head of departments
    const populatedHeads = await Promise.all(
      headOfDepartments.map(async (head) => {
        return populateSupervisedEmployees(req, head);
      }),
    );

    //count how many people for each department
    const dataSet = departments.map((dept) => {
      const [head] = populatedHeads.filter((p) => {
        return dept.head.equals(p[0]._id);
      });
      const allSupervisedEmployees = flatMapAllSupervisedEmployees(
        head[0].supervisedEmployees,
      );
      const totalCount = allSupervisedEmployees.length + 1;
      return {
        label: dept.name,
        count: totalCount,
      };
    });

    res.send({ data: dataSet });
  } catch (err) {
    req.logger.error(err);
    next(err);
  }
}

function flatMapAllSupervisedEmployees(supervisedEmployees) {
  return supervisedEmployees.flatMap((e) => {
    if (e.supervisedEmployees && e.supervisedEmployees.length > 0) {
      return flatMapAllSupervisedEmployees(e.supervisedEmployees).concat(e);
    }
    return [e];
  });
}
