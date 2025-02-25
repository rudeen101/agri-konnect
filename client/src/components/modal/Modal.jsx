import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./modal.css";

const CustomModal = ({ show, handleClose, title, btnText, children, onClick }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* Modal Header */}
      <Modal.Header className="custom-modal-header" closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className="custom-modal-body">{children}</Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer className="custom-modal-footer">
        <Button variant="none" className="custom-cancel-btn" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="none" className="custom-submit-btn" onClick={onClick()}>
          {btnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
