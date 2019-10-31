import Mail from '../../lib/Mail';

class AssistanceMail {
  get key() {
    return 'AssistanceMail';
  }

  async handle({ data }) {
    const { checkingNameEmail, helpId, getAnswer } = data;

    await Mail.sendMail({
      to: `${checkingNameEmail.name}  <${checkingNameEmail.email}>`,
      subject: 'Enviado com sucesso',
      template: 'assistance',
      context: {
        student: checkingNameEmail.name,
        question: helpId.question,
        answer: getAnswer.answer,
      },
    });
  }
}

export default new AssistanceMail();
