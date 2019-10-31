import mongoose from 'mongoose';

const AssistanceSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    answer_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Assistance', AssistanceSchema);
