const Modal = ({ isOpen, isClosed, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div>
        <span onClick={isClosed}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
