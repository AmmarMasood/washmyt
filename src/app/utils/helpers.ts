// Custom validation rules for expiration date
export const validateExpirationDate = (_: any, value: any) => {
  const [month, year] = value.split("/");

  if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return Promise.reject("Please enter a valid expiration date (MM/YY)");
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (+year < currentYear || (+year === currentYear && +month < currentMonth)) {
    return Promise.reject("The expiration date must be in the future");
  }

  return Promise.resolve();
};

export const validateCardNumber = (_: any, value: any) => {
  // Remove any non-digit characters from the input value
  const cardNumber = value.replace(/\D/g, "");

  // Validate the card number format using regex
  if (!/^\d{16}$/.test(cardNumber)) {
    return Promise.reject("Please enter a valid 16-digit card number");
  }

  // You can perform additional validation checks here if needed

  return Promise.resolve();
};

export const convertFromCent = (value: any) => {
  return parseFloat(value) / 100;
};
