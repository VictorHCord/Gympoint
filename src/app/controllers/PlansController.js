import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const allPlans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(allPlans);
  }

  async store(req, res) {
    const plansExist = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (plansExist) {
      return res.status(400).json({ error: 'Plans already exist' });
    }

    const { title, duration, price } = await Plans.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    /*
     ** Vai passar o id pelos parametros e em seguida vai verificar se o Id exist
     ** Se o id existe então ele vai fazer o update dos produtos informados no req.body
     */
    const { myPlanId } = req.params;

    const plan = await Plans.findByPk(myPlanId);

    if (!plan) {
      return res.status(400).json({ error: ' Plans does not exist' });
    }
    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    /*
     ** Vai passar o id pelos parametros e em seguida vai verificar se o Id exist
     ** Se o id existe então ele vai fazer o delete dos produtos
     */
    const { myPlanId } = req.params;

    const plan = await Plans.findByPk(myPlanId);

    if (!plan) {
      return res.status(400).json({ error: ' Plans does not exist' });
    }
    await plan.destroy({
      where: {
        id: myPlanId,
      },
    });

    return res.json({ message: 'Plans delete with success' });
  }
}
export default new PlansController();
