import React, { useState, useMemo } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

const TankControl = ({
  tankCapacity,
  setTankCapacity,
  handleRefill,
  feedUsed,
  currentFeederId,
}) => {
  const [inputTankCapacity, setInputTankCapacity] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const isValidInput = /^[\d]+$/.test(newValue);
    if (isValidInput || newValue === "") {
      setInputTankCapacity(newValue);
      setValidationError("");
    } else {
      setValidationError(
        "Please enter only numbers (no digits) and no minus values."
      );
    }
  };

  const handleConfirmSetTankCapacity = () => {
    const newTankCapacity = parseFloat(inputTankCapacity);
    if (!isNaN(newTankCapacity) && newTankCapacity <= 800) {
      setTankCapacity(newTankCapacity);
      setInputTankCapacity("");
      setIsUpdateModalOpen(false);
    } else {
      alert("Please enter a valid tank capacity (maximum 800).");
    }
  };

  const handleConfirmRefill = () => {
    handleRefill();
    setIsRefillModalOpen(false);
  };

  const feederInfo = useMemo(() => {
    const adjustedFeedUsed = Math.max(0, feedUsed);

    return [
      {
        title: "Feed Remaining",
        value: <>{adjustedFeedUsed.toFixed(2)} (Kgs)</>,
      },
      {
        title: "Tank Capacity",
        value: <>{Math.floor(Math.max(0, tankCapacity))} (Kgs)</>,
      },
    ];
  }, [tankCapacity, feedUsed]);

  return (
    <>
      <Row className="justify-content-center">
        {/*<Col lg={6} className="mb-4">
          <Card style={{ minHeight: "170px", height: "170px" }}>
            <CardHeader>
              <h5 className="card-title mb-0">Tank Control</h5>
            </CardHeader>
            <CardBody>
              <FormGroup className="d-flex justify-content-center align-items-center">
                <Input
                  type="text"
                  placeholder="Enter Tank Capacity"
                  value={inputTankCapacity}
                  onChange={handleInputChange}
                  pattern="\d*"
                  maxLength="3"
                  className="me-2"
                  width={"300"}
                />
                <div className="text-danger me-2">{validationError}</div>
                <Button
                  color="primary"
                  className="me-2"
                  onClick={() => setIsRefillModalOpen(true)}
                >
                  Refill to 100%
                </Button>
                <Button
                  color="success"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  Set Capacity
                </Button>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>*/}
        {feederInfo.map(({ title, value }) => (
          <Col key={title} lg={6} xl={6} md={6} className="mb-4">
            <Card style={{ minHeight: "170px", height: "170px" }}>
              <CardHeader>
                <h5 className="card-title mb-0">{title}</h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex align-items-center justify-content-between m-1">
                  <div className="align-items-center">
                    <h6 className="fs-22 fw-semibold ff-secondary align-items-center">
                      <span
                        className="counter-value align-items-center"
                        data-target="100"
                      >
                        {value}
                      </span>
                    </h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        isOpen={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
      >
        <ModalHeader toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}>
          Confirm Update
        </ModalHeader>
        <ModalBody>
          Are you sure you want to update the tank capacity?
        </ModalBody>
        <ModalFooter>
          {/* <Button color="secondary" onClick={() => setIsUpdateModalOpen(false)}>
            Cancel
          </Button> */}
          <Button color="primary" onClick={handleConfirmSetTankCapacity}>
            Yes, Update
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isRefillModalOpen}
        toggle={() => setIsRefillModalOpen(!isRefillModalOpen)}
      >
        <ModalHeader toggle={() => setIsRefillModalOpen(!isRefillModalOpen)}>
          Confirm Refill
        </ModalHeader>
        <ModalBody>Are you sure you want to refill the tank to 100%?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsRefillModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleConfirmRefill}>
            Yes, Refill
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TankControl;
