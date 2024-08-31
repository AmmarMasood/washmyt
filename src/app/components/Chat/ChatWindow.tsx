import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageInput from "./MessageInput";
import { addConversation, getToken } from "./api";
import {
  Message,
  Conversation,
  Participant,
  Client,
  ConnectionState,
} from "@twilio/conversations";
import { message as antdmessage } from "antd";
import {
  handleChatPayload,
  handleMessagePayload,
  handleParticipantPayload,
} from "./handlers";
import { washerWithAdminKey } from "./contants";

interface ChatWindowProps {
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  washId: string;
  washerEmail?: string;
  userEmail?: string;
  otherParticipantName?: string;
  extraStyles?: string;
  windowType: "washer" | "admin" | "customer";
}

function ChatWindow({
  showChat,
  setShowChat,
  loading,
  token,
  setLoading,
  washId,
  washerEmail,
  userEmail,
  otherParticipantName,
  extraStyles,
  windowType,
}: ChatWindowProps) {
  const [allMessages, setAllMessages] = React.useState<any[]>([]);
  const [ogConversation, setOgConversation] = React.useState<any>(null);
  const [conversation, setConversation] = React.useState<any>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [client, setClient] = React.useState<Client | null>(null);
  const [message, setMessage] = React.useState<string>("");
  //
  const [files, setFiles] = useState<File[]>([]);
  // needed to clear input type=file
  const [filesInputKey, setFilesInputKey] = useState<string>("input-key");
  const messagesContainerRef = useRef(null);
  const conversationRef = useRef(conversation);
  const [windowMessage, setWindowMessage] = useState("");
  conversationRef.current = conversation;

  useEffect(() => {
    if (!files.length) {
      setFilesInputKey(Date.now().toString());
    }
  }, [files]);

  // wrap this in a callback
  const createNewConversation = async (name: string) => {
    if (!client) return;
    setLoading(true);
    try {
      const conversation = await addConversation(name, client);
      const conv = handleChatPayload(conversation);
      setConversation(conv);
      setOgConversation(conversation);
    } catch (err) {
      console.log("err", err);
    }
    setLoading(false);
  };

  const getConversation = async (name: string) => {
    if (!client) return;
    setLoading(true);
    try {
      const conversation = await client.getSubscribedConversations();
      const currentConversation = conversation.items.find
        ? conversation.items.find((conv) => conv.friendlyName === name)
        : null;

      console.log("cuurent conv", currentConversation);
      if (
        !currentConversation &&
        windowType === "washer" &&
        !washId.includes(washerWithAdminKey)
      ) {
        setWindowMessage("Waiting for the customer to start the chat");
        setLoading(false);
        return;
      }

      if (!currentConversation && windowType === "admin") {
        setWindowMessage(
          washId.includes(washerWithAdminKey)
            ? "Waiting for the washer to start the chat"
            : "Waiting for the customer to start the chat"
        );
        setLoading(false);
        return;
      }

      if (currentConversation) {
        const conv = handleChatPayload(currentConversation);
        setOgConversation(currentConversation);
        setConversation(conv);
        return;
      } else {
        throw new Error("Not Found");
      }
    } catch (err: any) {
      if (err.message === "Not Found") {
        createNewConversation(name);
        console.log("user is not part of any conversations");
      }
      console.log("damning");
    }
    setLoading(false);
  };

  const getMessages = async () => {
    setLoading(true);
    try {
      const messages = await ogConversation.getMessages();
      const mes = messages.items.map((t: any) => handleMessagePayload(t));
      const resolved = await Promise.all(mes);
      setAllMessages(resolved);
      setMessages(resolved);
    } catch (err) {
      console.log("err", err);
    }
    setLoading(false);
  };

  const getParticipants = async () => {
    if (washerEmail === undefined) return;
    setLoading(true);
    try {
      const participants = await ogConversation.getParticipants();
      const p = participants.map((t: any) => handleParticipantPayload(t));
      const washer = p.find((t: any) => t.identity === washerEmail);
      if (!washer) {
        await ogConversation.add(washerEmail);
      }
    } catch (err) {
      console.log("err", err);
    }
    setLoading(false);
  };

  const onMessageAddedCallback = useCallback(
    async (message: Message) => {
      if (message?.conversation.sid !== conversationRef.current?.sid) return;
      // TODO FIX THAT TOO MANY APIS CALLS
      const mes = await handleMessagePayload(message);
      setMessages((prev) => [...prev, mes]);
    },
    [allMessages]
  );

  useLayoutEffect(() => {
    const { current: messageContainer } = messagesContainerRef as any;
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages, showChat]);

  useEffect(() => {
    if (ogConversation) {
      getMessages();
      getParticipants();
    }
  }, [ogConversation]);

  useEffect(() => {
    if (client && token) {
      getConversation(`Chat-${washId}`);

      client.on("conversationJoined", (conversation) => {
        console.log("conversation joined", conversation);
      });

      client.on("messageAdded", onMessageAddedCallback);

      // refresh connection if disconnected

      client.on("connectionStateChanged", (state: ConnectionState) => {
        if (state === "disconnected") {
          client.updateToken(token);
        }
      });
    }
  }, [client]);

  useEffect(() => {
    if (token) {
      const client = new Client(token);

      setClient(client);
    }
  }, [token]);

  const onEnterKeyPress = () => {
    console.log("im pressed");
  };

  const onChange = (e: any) => {
    setMessage(e);
  };

  const onSend = async () => {
    if (!message && files.length === 0) return;
    try {
      for (const file of files) {
        const fileData = new FormData();
        fileData.append("file", file);
        await ogConversation.sendMessage(fileData);
      }

      if (message) {
        await ogConversation.sendMessage(message);
      }

      setMessage("");
      setFiles([]);
    } catch (err) {
      console.log("err", err);
    }
  };

  const onFilesChanged = (event: any) => {
    const { files: assets } = event.target;
    if (!assets?.length) {
      return;
    }

    const validFiles = Array.from(assets).filter(
      ({ size }: any) => size < 52428800 + 1
    );

    if (validFiles.length < assets.length) {
      // TODO: show error
      antdmessage.error("file size is too large");
      return;
    }

    setFiles([...files, ...validFiles] as any);
  };

  const onFileRemove = (name: string) => {
    setFiles(files.filter((file) => `${file.name}_${file.size}` !== name));
  };
  return (
    showChat && (
      <div
        className={`h-[500px] w-96 max-sm:w-72  bg-white absolute right-10 bottom-10 z-10 shadow-2xl rounded-xl overflow-hidden ${extraStyles}`}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-black text-lg">Loading...</p>
          </div>
        ) : token ? (
          windowMessage ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-black">{windowMessage}</p>
            </div>
          ) : (
            <div className="h-full">
              <h1 className="text-center p-2 text-lg font-bold text-black-600 bg-gray-100 mb-2">
                {otherParticipantName}
              </h1>
              <div
                className="mb-2 h-[360px]  overflow-y-auto px-2"
                ref={messagesContainerRef}
              >
                {messages.map((message: any) =>
                  message.media ? (
                    <div
                      key={message.sid}
                      className={`flex ${
                        washerEmail
                          ? message.author === washerEmail
                            ? "justify-start"
                            : "justify-end"
                          : message.author === userEmail
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`w-42 p-2 m-1 rounded-xl  ${
                          washerEmail
                            ? message.author === washerEmail
                              ? "bg-gray-300"
                              : "bg-primary-color"
                            : message.author === userEmail
                            ? "bg-primary-color"
                            : "bg-gray-300"
                        }`}
                      >
                        <img src={message?.media} alt="media" />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={message.sid}
                      className={`flex ${
                        washerEmail
                          ? message.author === washerEmail
                            ? "justify-start"
                            : "justify-end"
                          : message.author === userEmail
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <p
                        className={`w-42 p-2 m-1 rounded-xl  ${
                          washerEmail
                            ? message.author === washerEmail
                              ? "bg-gray-300"
                              : "text-white bg-primary-color"
                            : message.author === userEmail
                            ? "text-white bg-primary-color"
                            : "bg-gray-300"
                        }`}
                      >
                        {message.body}
                      </p>
                    </div>
                  )
                )}
              </div>

              <MessageInput
                assets={files}
                onEnterKeyPress={onEnterKeyPress}
                message={message}
                onChange={onChange}
                onSend={onSend}
                onFilesChange={onFilesChanged}
                onFileRemove={onFileRemove}
              />
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-black">Unable to connect with chat...</p>
          </div>
        )}
      </div>
    )
  );
}

export default ChatWindow;
