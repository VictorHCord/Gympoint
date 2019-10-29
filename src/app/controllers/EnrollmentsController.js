import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Enrollments from '../models/Enrollments';
import Student from '../models/Student';
import Plans from '../models/Plans';
import Notification from '../schemas/Notification';

class EnrollmentstController {
  async index(req, res) {
    const enrollments = await Enrollments.findAll({
      order: ['id'],
      attributes: [
        'id',
        'start_date',
        'end_date',
        'price',
        'plan_id',
        'student_id',
      ],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name', 'age', 'email'],
        },
        {
          model: Plans,
          as: 'plans',
          attributes: ['title', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollments = await Enrollments.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name'],
        },

        {
          model: Plans,
          as: 'plans',
          attributes: ['title', 'price'],
        },
      ],
    });
    return res.json(enrollments);
  }

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

    /* Notify about created of enrollments */

    const getName = await Student.findOne({
      where: { id: student_id },
    });

    const formattedDate = format(
      startDate,
      "'Data de inicio:' dd 'de' MMMM 'de' yyyy ', às' H:mm'h'",

      { locale: pt }
    );

    const formattedEnd = format(
      finalDate,
      "'Data de encerramento:' dd 'de' MMMM 'de' yyyy ', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Inscrição realizada, no nome de ${getName.name}. ${formattedDate} e ${formattedEnd}`,
      user: student_id,
    });

    return res.json(createRegis);
  }

  async update(req, res) {
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
    /* Get ID params and verify o id for update  */
    const enrollmentUpdate = await Enrollments.findOne({
      where: { id: req.params.id },
    });

    if (!enrollmentUpdate) {
      return res.status(400).json({ error: 'User does not register' });
    }
    /* Calculate value of price */
    const totalPrice = await (plansAvailable.price * plansAvailable.duration);

    /* Calculate final date */

    const finalDate = addMonths(startDate, plansAvailable.duration);

    await enrollmentUpdate.update({
      plan_id,
      student_id,
      start_date: startDate,
      end_date: finalDate,
      price: totalPrice,
    });
    return res.json(enrollmentUpdate);
  }

  async delete(req, res) {
    const enrollmentUpdate = await Enrollments.findOne({
      where: { id: req.params.id },
    });

    if (!enrollmentUpdate) {
      return res.status(400).json({ error: 'User does not register' });
    }

    await enrollmentUpdate.destroy({
      where: { id: enrollmentUpdate },
    });
    return res.json({ message: 'Enrollments delete with sucess' });
  }
}

export default new EnrollmentstController();
