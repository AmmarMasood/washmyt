import { Box, Button } from "@twilio-paste/core";
import { ChatComposer } from "@twilio-paste/core/chat-composer";
import {
  $getRoot,
  ClearEditorPlugin,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_LOW,
  EditorState,
  KEY_ENTER_COMMAND,
  useLexicalComposerContext,
} from "@twilio-paste/lexical-library";
import Image from "next/image";
import { useEffect } from "react";
import SendButton from "../../../../public/imgs/icons8-send-button-30.png";
import AttachmentButton from "../../../../public/imgs/icons8-attachment-48.png";
import MessageFile from "./MessageFile";

interface MessageInputProps {
  message: string;
  onChange: (message: string) => void;
  onFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyPress: () => void;
  onSend: () => void;
  assets: File[];
  onFileRemove: (name: string) => void;
}

interface EnterKeyPluginProps {
  onEnterKeyPress: () => void;
}

const EnterKeyPlugin = (props: EnterKeyPluginProps) => {
  const { onEnterKeyPress } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        onEnterKeyPress();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onEnterKeyPress]);

  return null;
};

// when message gets cleared and given it's a prop passed in to MessageInput
// we need to clear the Lexical editor.
// TODO: there has to be a simpler way of doing a basic binding like this with Lexical

interface MessagePropPluginProps {
  message: string;
}

const MessagePropPlugin = (props: MessagePropPluginProps) => {
  const { message } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (message === undefined || message === null || message.length === 0) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    }
  }, [editor, message]);

  return null;
};

const MessageInput: React.FC<MessageInputProps> = (
  props: MessageInputProps
) => {
  const { onEnterKeyPress, message, onChange, onSend, onFilesChange } = props;

  return (
    <Box className="absolute bottom-0 w-full px-4 py-4 bg-gray-200">
      <div className="p-2 bg-gray-100 w-full flex justify-between items-center rounded-xl">
        <Button variant="link">
          <label htmlFor="file-input">
            <Image
              onClick={onSend}
              src={AttachmentButton}
              alt="Chat"
              height={26}
              width={26}
              className="mr-2 cursor-pointer"
            />
          </label>
          <input
            id="file-input"
            key={"input-key"}
            type="file"
            style={{ display: "none" }}
            onChange={onFilesChange}
          />
        </Button>
        <div className="w-[300px]">
          <ChatComposer
            config={{
              namespace: "message-input",
              onError: (e: any) => {
                throw e;
              },
            }}
            ariaLabel="A basic chat composer"
            placeholder={"Type a message"}
            onChange={(editorState: EditorState): void => {
              editorState.read(() => {
                const text = $getRoot().getTextContent();
                onChange(text);
              });
            }}
          >
            <ClearEditorPlugin />
            <MessagePropPlugin message={message} />
            <EnterKeyPlugin onEnterKeyPress={onEnterKeyPress} />
          </ChatComposer>
        </div>
        <Image
          onClick={onSend}
          src={SendButton}
          alt="Chat"
          height={26}
          width={26}
          className="ml-2 cursor-pointer"
        />
      </div>
      {props.assets.length > 0 && (
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {props.assets.map(({ name, size }) => (
            <MessageFile
              key={`${name + "_" + size}`}
              media={{ filename: name, size }}
              onRemove={() => props.onFileRemove(name + "_" + size)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MessageInput;
