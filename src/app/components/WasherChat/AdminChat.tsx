import React, { useState } from "react";
import { Theme } from "@twilio-paste/core/dist/theme";
import { Box } from "@twilio-paste/core";
import styles from "../Chat/twillio-styles";
import Image from "next/image";
import ChatIcon from "../../../../public/imgs/icons8-chat-96.png";
import { Drawer, Space } from "antd";
import Button from "../Button";
import { getTokenWhenSignedIn, getTokenWithWashId } from "../Chat/api";
import ChatWindow from "../Chat/ChatWindow";
import {
  adminEmail,
  adminName,
  washerWithAdminKey,
  withAdminKey,
} from "../Chat/contants";

interface AdminChatProps {
  washId: string;
  userEmail: string;
  customerName: string;
  washerName: string;
}

function AdminChat(props: AdminChatProps) {
  const { washId, userEmail, customerName, washerName } = props;
  const [open, setOpen] = useState(false);
  const [openAdminChat, setOpenAdminChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const connectChat = async () => {
    if (washId) {
      setLoading(true);
      try {
        const res: any = await getTokenWhenSignedIn();
        setToken(res.token);
      } catch (error) {
        console.log("error", error);
      }
      setLoading(false);
    }
  };

  React.useEffect(() => {
    connectChat();
  }, []);

  return (
    token && (
      <div className="relative h-[70px]">
        <div className="absolute right-30 bottom-0 flex items-center justify-between">
          <div className="mr-4">
            <Theme.Provider theme="twilio">
              <Box style={styles.app}>
                <ChatWindow
                  showChat={open}
                  setShowChat={setOpen}
                  loading={loading}
                  setLoading={setLoading}
                  token={token}
                  setToken={setToken}
                  userEmail={userEmail}
                  washId={`${washId}${washerWithAdminKey}`}
                  // washerEmail={adminEmail}
                  otherParticipantName={washerName}
                />
              </Box>
            </Theme.Provider>
            <div
              className="bg-white w-fit rounded-full p-3 shadow-lg cursor-pointer relative flex items-center"
              onClick={(prev) => setOpen(!open)}
            >
              <Image src={ChatIcon} alt="Chat" height={60} width={60} />
              <p className="text-black">Washer</p>
            </div>
          </div>
          <div>
            <Theme.Provider theme="twilio">
              <Box style={styles.app}>
                <ChatWindow
                  showChat={openAdminChat}
                  setShowChat={setOpenAdminChat}
                  loading={loading}
                  setLoading={setLoading}
                  token={token}
                  setToken={setToken}
                  userEmail={userEmail}
                  washId={`${washId}${withAdminKey}`}
                  // washerEmail={adminEmail}
                  otherParticipantName={customerName}
                />
              </Box>
            </Theme.Provider>
            <div
              className="bg-white w-fit rounded-full p-3 shadow-lg cursor-pointer relative flex items-center"
              onClick={(prev) => setOpenAdminChat(!openAdminChat)}
            >
              <Image src={ChatIcon} alt="Chat" height={60} width={60} />
              <p className="text-black">Customer</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default AdminChat;
