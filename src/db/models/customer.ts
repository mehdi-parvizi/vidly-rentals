import { connect, Schema, model } from "mongoose";

export const customerSchema = new Schema({
  isGold: Schema.Types.Boolean,
  name: Schema.Types.String,
  phone: Schema.Types.String,
});

export const Customer = model("Customer", customerSchema);

export const getCustomers = async () => {
  try {
    return await Customer.find();
  } catch (err) {
    return err;
  }
};

export const getCustomer = async (id: any) => {
  try {
    const customer = await Customer.findById(id).select("-password");
    console.log(customer);
    return customer;
  } catch (err) {
    return err;
  }
};

export const createCustomer = async (
  name: string,
  isGold: boolean,
  phone: string
) => {
  console.log(name, phone, isGold);
  try {
    let customer = new Customer({ name, isGold, phone });
    customer = await customer.save();
    return customer;
  } catch (err) {
    return err;
  }
};

export const deleteCustomer = async (id: any) => {
  try {
    const result = await Customer.findByIdAndDelete(id);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateCustomer = async (
  id: any,
  name: string,
  phone: string,
  isGold: boolean
) => {
  try {
    let customer = await Customer.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          phone,
          isGold,
        },
      },
      { new: true }
    );
    customer = await customer!.save();
    return customer;
  } catch (err) {
    return err;
  }
};
