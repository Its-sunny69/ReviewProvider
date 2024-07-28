import React from "react";
import CloseOutlined from "@ant-design/icons"

const Modal = ({ isOpen, isClosed, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 inset-0 flex items-center justify-center z-50">
      <div className="w-3/5 h-3/5 backdrop-blur-lg rounded-md flex flex-col p-5">
        <p className="text-2xl font-bold" onClick={isClosed}>x</p>
        {children}
      </div>
    </div>
  );
};

export default Modal;
