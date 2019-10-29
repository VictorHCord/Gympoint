import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';
import Enrollments from '../models/Enrollments';
import Student from '../models/Student';
import Plans from '../models/Plans';

class EnrollmentstController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, plan_id } = req.body;

    const checkEnrolls = await Student.findOne({
      where: { id: student_id },
      attributes: ['name', 'email'],
    });

    if (!checkEnrolls) {
      return res.status(401).json({ error: 'Student dont have id' });
    }

    const startDate = parseISO(req.body.start_date);

    /* verify if dates is before or not  */
    if (isBefore(startDate, new Date())) {
      return res.status(400).json({
        error: 'past dates are not permitted',
      });
    }

    /* Check if student have enrollments   */

    const checkEnrollsment = await Enrollments.findOne({
      where: {
        student_id,
        start_date: startDate,
      },
    });

    if (checkEnrollsment) {
      return res.status(401).json({ error: 'Enrollsment is not available' });
    }

    const plansAvailable = await Plans.findOne({
      where: { id: plan_id },
      attributes: ['title', 'duration', 'price'],
    });

    if (!plansAvailable) {
      return res
        .status(401)
        .json({ error: 'Plans does not exist, please careful' });
    }

    /* Calculate value of price */
    const totalPrice = await (plansAvailable.price * plansAvailable.duration);

    /* Calculate final date */

    const finalDate = addMonths(startDate, plansAvailable.duration);

    const createRegis = await Enrollments.create({
      plan_id,
      student_id,
      start_date: startDate,
      end_date: finalDate,
      price: totalPrice,
    });
    return res.json(createRegis);
  }
}

export default new EnrollmentstController();
