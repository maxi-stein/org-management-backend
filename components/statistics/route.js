import { Router } from 'express';
import { populateSupervisedEmployees } from '../user/route.js';
import { LevelEnum } from '../position/schema.js';

export const statsRouter = new Router();
statsRouter.get('/departments-people', getDeptPeople);
statsRouter.get('/seniorities', getSeniorities);

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
        return dept.head?.equals(p[0]._id);
      });
      const allSupervisedEmployees =
        head?.[0].supervisedEmployees?.length > 0
          ? flatMapAllSupervisedEmployees(head[0].supervisedEmployees)
          : [];
      const totalCount = allSupervisedEmployees.length + (head ? 1 : 0);
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

async function getSeniorities(req, res, next) {
  req.logger.info('getSeniorities');

  try {
    const quantiyBySeniority = await Promise.all(
      LevelEnum.map(async (level) => {
        const count = await req
          .model('User')
          .find({ positionLevel: level.value })
          .countDocuments();
        return {
          label: level.label,
          count,
        };
      }),
    );
    const otherLevels =
      (await req.model('User').find().countDocuments()) -
      quantiyBySeniority.reduce((a, b) => a + b.count, 0);
    quantiyBySeniority.push({ label: 'Other', count: otherLevels });

    res.send({ data: quantiyBySeniority });
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
