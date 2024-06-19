// +18447315351 twilio phone number
import twilio from "twilio";
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken, authToken);

export const sendSms = (phone: string, message: string) => {
  console.log("phone", phone, message, accountSid);
  client.messages
    .create({
      body: message,
      from: process.env.NEXT_PUBLIC_TWILIO_NUMBER,
      to: phone,
    })
    .then((message: any) => {
      console.log("message", message);
    })
    .catch((err) => {
      console.log("error", phone);
      console.log("error", err);
    });
};
