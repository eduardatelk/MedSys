import express from "express";
import PacientService from "../services/PacientService.js";

let router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pacients = await PacientService.getAllPacients();
    res.send(pacients);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pacient = await PacientService.getPacient(id);
    res.send(pacient);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  const { name, birthDate, email, phone } = req.body;
  try {
    const pacient = await PacientService.savePacient({
      name,
      birthDate,
      email,
      phone,
    });
    res.status(201).send(pacient);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, birthDate, email, phone } = req.body;

  try {
    const pacient = await PacientService.updatePacient(id, {
      name,
      birthDate,
      email,
      phone,
    });
    res.send(pacient);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pacient = await PacientService.deletePacient(id);
    res.send(pacient);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
