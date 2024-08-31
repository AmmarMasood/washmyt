import React from "react";

import ChatIcon from "../../../../public/imgs/icons8-chat-96.png";
import Image from "next/image";
import ChatWindow from "./ChatWindow";
import { Theme } from "@twilio-paste/core/theme";
import { Box } from "@twilio-paste/core";
import styles from "./twillio-styles";
import { getToken, getTokenWithWashId } from "./api";
import { adminEmail, adminName, withAdminKey } from "./contants";

interface ChatProps {
  washId?: string;
  washerEmail?: string;
  washerName?: string;
}
function Chat(props: ChatProps) {
  const { washId, washerEmail, washerName } = props;
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [showAdminChat, setShowAdminChat] = React.useState(false);
  const connectChat = async () => {
    if (washId) {
      setLoading(true);
      try {
        const res: any = await getTokenWithWashId(washId);
        setToken(res.token);
      } catch (error) {
        console.log("error", error);
      }
      setLoading(false);
    }
  };

  React.useEffect(() => {
    connectChat();
  }, [washId]);

  return (
    washId && (
      <div className="fixed bottom-0 w-full">
        <div className="flex w-full items-end justify-center mb-16 max-md:justify-end max-sm:flex-col max-sm:mb-4">
          <div className="mr-4 relative">
            <Theme.Provider theme="twilio">
              <Box style={styles.app}>
                <ChatWindow
                  showChat={showChat}
                  setShowChat={setShowChat}
                  loading={loading}
                  setLoading={setLoading}
                  token={token}
                  setToken={setToken}
                  washId={washId}
                  washerEmail={washerEmail}
                  otherParticipantName={washerName}
                  windowType="customer"
                />
              </Box>
            </Theme.Provider>
            <div
              className="bg-white w-fit rounded-full p-3 shadow-lg cursor-pointer relative flex items-center"
              onClick={(prev) => setShowChat(!showChat)}
            >
              <Image src={ChatIcon} alt="Chat" height={60} width={60} />
              <p className="text-black">Washpro</p>
            </div>
          </div>
          <div className="relative">
            <Theme.Provider theme="twilio">
              <Box style={styles.app}>
                <ChatWindow
                  showChat={showAdminChat}
                  setShowChat={setShowAdminChat}
                  loading={loading}
                  setLoading={setLoading}
                  token={token}
                  setToken={setToken}
                  washId={`${washId}${withAdminKey}`}
                  washerEmail={adminEmail}
                  otherParticipantName={adminName}
                  windowType="customer"
                />
              </Box>
            </Theme.Provider>
            <div
              className="bg-white w-fit rounded-full p-3 shadow-lg cursor-pointer relative flex items-center"
              onClick={(prev) => setShowAdminChat(!showAdminChat)}
            >
              <Image src={ChatIcon} alt="Chat" height={60} width={60} />
              <p className="text-black">Customer support</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Chat;
