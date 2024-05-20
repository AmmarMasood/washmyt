/* Initialization */
import { Client } from "@twilio/conversations";
const accountSid = process.env.NEXT_PUBLIC_TWILIO_CONVERSATION_SID;

const client = new Client(accountSid as string);
client.on("connectionError", (error) => {
  console.error("Connection error:", error, accountSid);
});

client.on("stateChanged", (state) => {
  if (state === "failed") {
    // The client failed to initialize
    console.log("failed using the client", state);
    return;
  }

  if (state === "initialized") {
    // Use the client
    console.log("using the client");
  }
});

export default client;
