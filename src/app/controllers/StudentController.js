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
}

export default new StudentController();
