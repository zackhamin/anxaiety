import React, { useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { ArrowUpDown, Mic, Camera } from "lucide-react";

interface InputWithIconsProps extends InputProps {}

export const InputWithIcons: React.FC<InputWithIconsProps> = (props) => {
  const [inputHeight, setInputHeight] = useState(48); // Initial height

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textArea = e.target;
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
    setInputHeight(textArea.scrollHeight);
  };

  return (
    <div
      className="relative w-full max-w-md"
      style={{ marginBottom: `${inputHeight - 48}px` }}
    >
      <textarea
        {...props}
        className="w-full py-3 pl-4 pr-12 text-lg border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none overflow-hidden"
        style={{ minHeight: "48px" }}
        onChange={handleInput}
      />
      <div className="absolute right-3 top-3 flex items-center space-x-2">
        <ArrowUpDown className="w-5 h-5 text-gray-400" />
        <Mic className="w-5 h-5 text-gray-400" />
        <Camera className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default InputWithIcons;
