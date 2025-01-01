import express from "express";

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../db/models/customer.ts";
import { validate } from "../middleware/validateBody.ts";
import customerSchema from "../schemas/customerSchema.ts";
import { auth, CustomRequest } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});

router.get("/profile", auth, async (req: CustomRequest, res) => {
  const customer = await getCustomer(req.params.id);
  if (!customer) {
    res.status(404).send("Requested customer does not exist");
    return;
  }
  res.send(customer);
});

router.post("/", auth, validate(customerSchema), async (req, res) => {
  const {
    body: { name, phone, isGold },
  } = req;
  const customer = await createCustomer(name, isGold, phone);
  if (!customer) {
    res.status(404).send("Requested customer does not exist");
    return;
  }
  res.send(customer);
});

router.put("/:id", validate(customerSchema), async (req, res) => {
  const {
    body: { name, phone, isGold },
  } = req;
  const customer = await updateCustomer(req.params.id, name, phone, isGold);
  if (!customer) {
    res.status(404).send("Requested customer does not exist");
    return;
  }
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await deleteCustomer(req.params.id);
  if (!customer) {
    res.status(404).send("Requested customer does not exist");
    return;
  }
  res.send(customer);
});

export default router;
