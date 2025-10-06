import express from "express";
import bcrypt from "bcrypt";
import DoctorService from "../services/DoctorService.js";

let router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    res.send(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await DoctorService.getDoctor(id);
    res.send(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/", async function (req, res) {
  const {
    name,
    login,
    password,
    medicalSpeciality,
    medicalRegistration,
    email,
    phone,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await DoctorService.saveDoctor({
      name,
      login,
      password: hashedPassword,
      medicalSpeciality,
      medicalRegistration,
      email,
      phone,
    });
    res.status(201).send(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send("Falha ao registrar médico" + error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    login,
    password,
    medicalSpecialty,
    medicalRegistration,
    email,
    phone,
  } = req.body;

  try {
    const doctor = await DoctorService.updateDoctor(id, {
      name,
      login,
      password,
      medicalSpecialty,
      medicalRegistration,
      email,
      phone,
    });
    res.send(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await DoctorService.deleteDoctor(id);
    res.send(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
