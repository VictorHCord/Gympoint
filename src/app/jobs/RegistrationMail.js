import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const {
      checkingNameEmail,
      plansAvailable,
      totalPrice,
      startDate,
      finalDate,
    } = data;

    await Mail.sendMail({
      to: `${checkingNameEmail.name}  <${checkingNameEmail.email}>`,
      subject: 'Enviado com sucesso',
      template: 'registration',
      context: {
        student: checkingNameEmail.name,
        plan: plansAvailable.title,
        totalPrice,
        initialDate: format(
          parseISO(startDate),
          "'dia' dd 'de' MMMM' de 'yyyy,' às' H:mm'h'",
          { locale: pt }
        ),
        finalDate: format(
          parseISO(finalDate),
          "'dia' dd 'de' MMMM' de 'yyyy,' às' H:mm'h'",
          { locale: pt }
        ),
      },
    });
  }
}

export default new RegistrationMail();
