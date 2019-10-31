import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';
import AssistanceMail from '../jobs/AssistanceMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const helpId = await HelpOrders.findByPk(id, {
      attributes: ['id', 'question', 'student_id', 'answer', 'answer'],
    });

    if (!helpId) {
      return res.status(400).json({ error: 'Request does not exist' });
    }

    const checkingNameEmail = await Student.findByPk(helpId.student_id, {
      attributes: ['name', 'email'],
    });

    if (!checkingNameEmail) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { answer, student_id } = req.body;

    const answer_at = new Date();

    const createAnswer = await HelpOrders.create({
      answer,
      answer_at,
      student_id,
      question: helpId.question,
    });

    const getAnswer = await HelpOrders.findOne({
      where: { answer },
    });
    await Queue.add(AssistanceMail.key, {
      checkingNameEmail,
      helpId,
      getAnswer,
    });

    return res.json(createAnswer);
  }
}
export default new AnswerController();
