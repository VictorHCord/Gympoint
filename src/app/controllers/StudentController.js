import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const UserExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exist' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const { email } = req.body;

    const user = await Student.findByPk(req.userId);

    if (email !== user.email) {
      const UserExists = await Student.findOne({
        where: { email },
      });

      if (UserExists) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }

    const { id, name, age, weight, height } = await user.update(req.body);

    return res.json({
      id,
      name,
      age,
      weight,
      height,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    return res.json(student);
  }
}

export default new StudentController();
