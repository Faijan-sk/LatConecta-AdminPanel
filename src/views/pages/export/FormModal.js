import React from 'react'
import { ModalBody } from 'reactstrap'

const FormModal = () => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-lg"
    >
      <ModalBody></ModalBody>
    </Modal>
  )
}

export default FormModal
