import { mongoose } from "mongoose";
import Doctor from "./Doctor.js";
import Pacient from "./Pacient.js";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: {
    type: Date,
    required: [true, "Appointment Date is required."],
  },
  doctorId: {
    type: String,
    required: [true, "Doctor Id is required."],
    validate: {
      validator: function (v) {
        const id = new mongoose.Types.ObjectId(v); // convertendo uma string em objeto ID para ser encontrado no banco
        return Doctor.exists({ _id: id });
      },
      message: (props) => `DoctorID ${props.value} not found.`,
    },
  },
  pacientId: {
    type: String,
    required: [true, "pacientId is required."],
    validate: {
      validator: function (v) {
        const id = new mongoose.Types.ObjectId(v); // convertendo uma string em objeto ID para ser encontrado no banco
        return Pacient.exists({ _id: id });
      },
      message: (props) => `PacientID ${props.value} not found.`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const appointment = mongoose.model("Appointment", appointmentSchema);
export default appointment;
