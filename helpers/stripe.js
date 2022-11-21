const stripe = require("stripe");
const { STRIPE_SECRET_KEY } = process.env;

const Stripe = stripe(STRIPE_SECRET_KEY);

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id);
  return customer;
};

const addNewCustomer = async (data) => {
  data.description = "New Customer For Bright Swipe";
  const customer = await Stripe.customers.create(data);

  return customer.id;
};

const updateCustomer = async (customerId, cardId) => {
  const customer = await Stripe.customers.update(customerId, {
    default_source: cardId,
  });
  return customer;
};

const addCard = async (customerId, token) => {
  const card = await Stripe.customers.createSource(customerId, {
    source: token,
  });

  return card;
};

const updateCard = async (customerId, cardId, exp_month, exp_year) => {
  const card = await Stripe.customers.updateSource(customerId, cardId, {
    exp_month: exp_month,
    exp_year: exp_year,
  });

  return card;
};

const retriveCard = async (customerId, cardId) => {
  const card = await Stripe.customers.retrieveSource(customerId, cardId);
  return card;
};

const listCard = async (customerId) => {
  const card = await Stripe.customers.listSources(customerId, {
    object: "card",
    limit: 20,
  });

  return card;
};

const deleteCard = async (customerId, cardId) => {
  const deleted = await Stripe.customers.deleteSource(customerId, cardId);
  return deleted;
};

const charge = async (amount, customerId, cardId) => {
  const finalAmount = amount * 100;
  const charge = await Stripe.charges.create({
    amount: finalAmount,
    currency: "usd",
    customer: customerId,
    source: cardId,
  });

  return charge;
};

module.exports = {
  getCustomerByID,
  addNewCustomer,
  updateCustomer,
  addCard,
  updateCard,
  retriveCard,
  listCard,
  deleteCard,
  charge,
};
