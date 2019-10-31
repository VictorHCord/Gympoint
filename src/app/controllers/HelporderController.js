import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

class HelporderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const { student_id } = req.params;

    const studentNotExist = await Student.findByPk(student_id);

    if (!studentNotExist) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const { question } = req.body;

    const help_orders = await HelpOrders.create({
      student_id,
      question,
    });

    return res.json(help_orders);
  }

  async index(req, res) {
    const { student_id } = req.params;

    const help_orders = await HelpOrders.findAll({
      where: { student_id },
      attributes: ['id', 'question', 'student_id'],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(help_orders);
  }
}

export default new HelporderController();
