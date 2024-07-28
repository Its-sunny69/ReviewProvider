import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Modal = ({ isOpen, isClosed, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 inset-0 flex items-center justify-center z-50">
          <motion.div
            className="w-3/5 h-3/5 backdrop-blur-lg rounded-md flex flex-col p-5 shadow-md"
            key="modal"
            initial={{ opacity: 0, scale:0.95}}
            animate={{ opacity: 1, scale:1}}
            exit={{ opacity: 0, scale:0.95}}
            transition={{ duration: 0.2 }}
          >
            <button
              className="w-fit text-3xl font-bold text-red-500 hover:text-red-300 hover:scale-125 flex justify-start items-center transition ease-in-out delay-120"
              onClick={isClosed}
            >
              x
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
