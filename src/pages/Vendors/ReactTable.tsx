import React, { useState } from "react";

import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import VendorsList from "./vendors-list";

const SearchTable = () => {
  const [modal_standard, setmodal_standard] = useState<boolean>(false);
  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  return (
    <React.Fragment>
      <VendorsList />
      {/* Default Modal */}
      <Modal
        id="myModal"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
      >
        <ModalHeader
          className="modal-title"
          id="myModalLabel"
          toggle={() => {
            tog_standard();
          }}
        >
          Modal Heading
        </ModalHeader>
        <ModalBody>
          <Row className="gy-4">
            <Col xxl={12} md={12}>
              <div>
                <Label htmlFor="valueInput" className="form-label">
                  Input with Value
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="valueInput"
                  defaultValue="Input value"
                />
              </div>
            </Col>
            <Col xxl={12} md={12}>
              <div>
                <Label htmlFor="exampleInputpassword" className="form-label">
                  Input Password
                </Label>
                <Input
                  type="password"
                  className="form-control"
                  id="exampleInputpassword"
                  defaultValue="44512465"
                />
              </div>
            </Col>
            <Col xxl={12} md={12}>
              <div>
                <Label htmlFor="iconInput" className="form-label">
                  Input with Icon
                </Label>
                <div className="form-icon">
                  <Input
                    type="email"
                    className="form-control form-control-icon"
                    id="iconInput"
                    placeholder="example@gmail.com"
                  />
                  <i className="ri-mail-unread-line"></i>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              tog_standard();
            }}
          >
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export { SearchTable };
