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
    </React.Fragment>
  );
};

export { SearchTable };
