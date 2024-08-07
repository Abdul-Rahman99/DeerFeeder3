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
import PermissionGuard from "../../../Components/Common/PermissionGuard";

const TankControl = ({
  tankCapacity,
  setTankCapacity,
  handleRefill,
  feedUsed,
  tray1,
  tray2,
  tray3,
  tray4,
  tankLevel2,
  hasCapacity,
  hasTray,
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

    console.log("hassss" + hasTray)
    let trays;
    if (hasTray) {
      trays = [
        {
          title: "Tray 1",
          value: `${tray1.toFixed(2)} (Kgs)`,
        },
        {
          title: "Tray 2",
          value: `${tray2.toFixed(2)} (Kgs)`,
        },
        {
          title: "Tray 3",
          value: `${tray3.toFixed(2)} (Kgs)`,
        },
        {
          title: "Tray 4",
          value: `${tray4.toFixed(2)} (Kgs)`,
        },
        {
          title: "Tank Wieght",
          value: `${tankLevel2.toFixed(2)} (Kgs)`,
        }
      ] 
    } else {
      trays = [
        {
          title: "Tank Wieght",
          value: `${tray1.toFixed(2)} (Kgs)`,
        },
      ];
    }

    

    return hasCapacity ? [
      
      {
        title: "Feed Remaining",
        value: <>{adjustedFeedUsed.toFixed(2)} (Kgs)</>,
      },
      {
        title: "Tank Capacity",
        value: <>{Math.floor(Math.max(0, tankCapacity))} (Kgs)</>,
      },
      // {
      //   title: "Refill Tank",
      //   value: (
      //     <>
      //       <PermissionGuard permissionName={"/manage-tank"}>
      //         <Button
      //           color="primary"
      //           className="me-2"
      //           onClick={() => setIsRefillModalOpen(true)}
      //         >
      //           Refill Feeder tank to 100%
      //         </Button>
      //       </PermissionGuard>
      //     </>
      //   ),
      // },
    ] : 

    trays
    ;

  }, [tankCapacity, feedUsed]);

  return (
    <>
      <Row className="justify-content-start">

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
