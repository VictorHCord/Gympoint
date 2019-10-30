import { endOfDay, startOfDay, format, subDays, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Checkins from '../models/Checkins';
import Student from '../models/Student';
import Enrollments from '../models/Enrollments';

class CheckinsController {
  async store(req, res) {
    const student_id = req.params.id;

    const studentNotExist = await Student.findOne({
      where: { id: student_id },
    });

    if (!studentNotExist) {
      return res.status(401).json({ error: 'Student does not exist' });
    }

    const enrollments = await Enrollments.findOne({
      where: { student_id },
    });
    if (!enrollments) {
      return res.status(401).json({ error: 'Not found enrollments' });
    }

    const oldDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');

    const oldCheckins = await Checkins.count({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(parseISO(oldDate)), endOfDay(new Date())],
        },
      },
    });

    if (oldCheckins === 5) {
      return res.status(401).json({ error: 'you login maxium' });
    }

    const checkin = await Checkins.create({ student_id });

    return res.json(checkin);
  }

  async show(req, res) {
    const checkin_id = await Checkins.findAll({
      where: { student_id: req.params.id },
    });

    if (!checkin_id) {
      return res.status(401).json({ error: 'Checkin not found' });
    }

    return res.json(checkin_id);
  }
}

export default new CheckinsController();
