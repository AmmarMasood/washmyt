import axios from "axios";
import {
  Conversation,
  Message,
  Participant,
  Media,
  Client,
  Paginator,
  User,
} from "@twilio/conversations";
import axiosApiInstance from "@/app/utils/axiosClient";

type ParticipantResponse = ReturnType<typeof Conversation.prototype.add>;

export async function getToken(
  username: string,
  password: string
): Promise<string> {
  const requestAddress = process.env
    .NEXT_PUBLIC_ACCESS_TOKEN_SERVICE_URL as string;
  if (!requestAddress) {
    throw new Error(
      "NEXT_PUBLIC_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login"
    );
  }

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: username, password: password },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from ${requestAddress}: ${error}\n`);
    throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
  }
}

export async function getTokenWithWashId(washId: string): Promise<string> {
  try {
    const response = await axiosApiInstance.get(`/api/chat?washId=${washId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from /chat: ${error}\n`);
    throw new Error(`ERROR received from /chat: ${error}\n`);
  }
}

export async function getTokenWhenSignedIn() {
  try {
    const response = await axiosApiInstance.get(`/api/chat/washer`);
    return response.data;
  } catch (error) {
    console.error(`ERROR received from /chat/washer: ${error}\n`);
    throw new Error(`ERROR received from /chat: ${error}\n`);
  }
}

export async function addConversation(
  name: string,
  client?: Client
): Promise<Conversation> {
  if (client === undefined) {
    throw new Error(
      "Client is suddenly undefined, are you sure everything is ok?"
    );
  }

  if (name.length === 0) {
    throw new Error("Conversation name is empty");
  }

  try {
    const conversation = await client.createConversation({
      friendlyName: name,
    });
    await conversation.join();

    return conversation;
  } catch (e) {
    console.error("Error creating conversation", e);
    throw e;
  }
}
