// export const getParticipantsAndMessages = async (conv: any) => {
//     try {
//       const messages = await conv.getMessages();
//       console.log(messages);
//       // setConversation({
//       //   ...conversation,
//       //   [conv.sid]: {
//       //     ...conversation[conv.sid],
//       //     messages: messages.items.map((t: any) => ({
//       //       body: t.body,
//       //       author: t.author,
//       //       index: t.index,
//       //     })),
//       //   },
//       // });
//     } catch (err) {
//       console.log("err", err);
//     }
//   };

//   export const onTypingStarted = async (participant: Participant, conv: any) => {
//     console.log("typing started", participant, conv);

//   }

//   export const onTypingEnded = async (participant: Participant, conv: any) => {
//     console.log("typing ended", participant, conv);

//   }
export interface Message {
  body: string;
  author: string;
  index: string;
}
export interface Conversation {
  sid: string;
  friendlyName: string;
  dateUpdated: string;
  notificationLevel: string;
  lastReadMessageIndex: string;
  lastMessage: string;
  messages?: Message[];
}
export const handleChatPayload = (conversation: any) => {
  if (!conversation) return;
  const {
    sid,
    friendlyName,
    dateUpdated,
    notificationLevel,
    lastReadMessageIndex,
    lastMessage,
  } = conversation;

  return {
    sid,
    friendlyName,
    dateUpdated,
    notificationLevel,
    lastReadMessageIndex,
    lastMessage,
  };
};

export const handleMessagePayload = async (message: any) => {
  if (!message) return;
  const { body, author, index, sid, media, type } = message;

  console.log("ammar 2", media, type);

  const messagePayload: any = {
    body,
    author,
    index,
    sid,
  };

  if (type === "media") {
    messagePayload["media"] = await media.getContentTemporaryUrl();
  }
  return messagePayload;
};

export const handleParticipantPayload = (participant: any) => {
  if (!participant) return;
  const { identity, sid } = participant;

  return {
    identity,
    sid,
  };
};
