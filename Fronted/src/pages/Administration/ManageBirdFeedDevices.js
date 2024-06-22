import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { Icon } from "@iconify/react";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Table,
} from "reactstrap";

const ManageBirdFeedDevices = () => {
  document.title = "Bird Feed Devices";
  const [tableData, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [feeder_id, setFeederId] = useState("");
  const [mac_address, setMacAdd] = useState("");
  const [camera_mac_address, setCameraMacAdd] = useState("");
  const [location, setLocation] = useState("");
  const [ip_address, setIP] = useState("");
  const [latitude, setLat] = useState("");
  const [longitude, setLong] = useState("");
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    axios
      .get(api.API_URL + "/api/getDevices")
      .then((res) => {
        if (res && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!feeder_id) newErrors.feeder_id = "Feeder ID is required";
    if (!location) newErrors.location = "Location is required";
    if (
      !mac_address ||
      !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac_address)
    )
      newErrors.mac_address = "Invalid MAC address";
    if (
      !camera_mac_address ||
      (!isValidMac(camera_mac_address) &&
        typeof camera_mac_address !== "string")
    ) {
      newErrors.camera_mac_address = "Invalid Camera MAC address";
    }
    if (
      !ip_address ||
      !/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.([0-9]{1,3}\.){2}[0-9]{1,3}$/.test(
        ip_address
      )
    )
      newErrors.ip_address = "Invalid IP address";
    if (latitude && isNaN(parseFloat(latitude)))
      newErrors.latitude = "Latitude must be a number";
    if (longitude && isNaN(parseFloat(longitude)))
      newErrors.longitude = "Longitude must be a number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidMac = (value) => {
    // Regular expression for MAC address validation (xx:xx:xx:xx:xx:xx)
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(value);
  };

  const saveInfo = () => {
    if (!validateInputs()) return;

    axios
      .post(api.API_URL + "/api/addDevice", {
        isNew,
        id,
        title,
        feeder_id,
        mac_address,
        camera_mac_address,
        location,
        ip_address,
        latitude,
        longitude,
      })
      .then((res) => {
        if (res && res.status === true) {
          tog_backdrop();
          updateData();
          toast(`Device ${isNew ? "Added" : "Updated"} Successfully`, {
            position: "top-right",
            hideProgressBar: true,
            closeOnClick: false,
            className: "bg-success text-white",
          });
        } else {
          setErrors({ global: "An error occurred. Please try again." });
          console.log("users", "0", res);
        }
      })
      .catch((err) => {
        setErrors({ global: "An error occurred. Please try again." });
        console.log("error", err);
      });
  };

  const updateStatus = (id, is_enabled) => {
    axios
      .post(api.API_URL + "/api/updateFeederStatus", { id, status: is_enabled })
      .then((res) => {
        if (res && res.status === true) {
          updateData();
          toast("Status Updated Successfully", {
            position: "top-right",
            hideProgressBar: true,
            closeOnClick: false,
            className: "bg-success text-white",
          });
        } else {
          setErrors({ global: "An error occurred. Please try again." });
          console.log("users", "0", res);
        }
      })
      .catch((err) => {
        setErrors({ global: "An error occurred. Please try again." });
        console.log("users", "1", err);
      });
  };

  const [modal_backdrop, setmodal_backdrop] = useState(false);
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const deleteFeeder = async (val) => {
    if (window.confirm("Are you sure you wish to delete?")) {
      axios
        .delete(api.API_URL + "/api/deleteFeeder/" + val.id)
        .then((res) => {
          if (res && res.status === true) {
            toast("Feeder Deleted Successfully", {
              position: "top-right",
              hideProgressBar: true,
              closeOnClick: false,
              className: "bg-success text-white",
            });
            updateData();
          } else {
            setErrors({ global: "An error occurred. Please try again." });
            console.log("feeders", "0", res);
          }
        })
        .catch((err) => {
          setErrors({ global: "An error occurred. Please try again." });
          console.log("feeders", "1", err);
        });
    }
  };

  const updateFields = (isNew, val) => {
    setErrors({});
    setIsNew(isNew);
    if (isNew) {
      setId("");
      setTitle("");
      setFeederId("");
      setLocation("");
      setIP("");
      setMacAdd("");
      setCameraMacAdd("");
      setLat("");
      setLong("");
    } else {
      setId(val.id);
      setTitle(val.title);
      setFeederId(val.feeder_id);
      setLocation(val.location);
      setIP(val.ip_address);
      setMacAdd(val.mac_address);
      setCameraMacAdd(val.camera_mac_address);
      let JsonC = JSON.parse(val.other_info);
      setLat(JsonC.latitude);
      setLong(JsonC.longitude);
    }
    tog_backdrop();
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <Modal
        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={"static"}
        id="staticBackdrop"
        centered
      >
        <ModalHeader
          className="modal-title"
          id="staticBackdropLabel"
          toggle={() => {
            tog_backdrop();
          }}
        >
          {isNew ? "Add" : "Update"} Bird Feeder
        </ModalHeader>
        <ModalBody className="p-3">
          <Row className="mt-2">
            <Col xl={6}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="form-control"
              />
              {errors.title && (
                <div className="text-danger">{errors.title}</div>
              )}
            </Col>
            <Col xl={6}>
              <label>Feeder ID:</label>
              <input
                type="text"
                name="feederid"
                id="feederid"
                value={feeder_id}
                onChange={(e) => setFeederId(e.target.value)}
                placeholder="Feeder ID"
                className="form-control"
              />
              {errors.feeder_id && (
                <div className="text-danger">{errors.feeder_id}</div>
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xl={6}>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="form-control"
              />
              {errors.location && (
                <div className="text-danger">{errors.location}</div>
              )}
            </Col>
            <Col xl={6}>
              <label>IP Address:</label>
              <input
                type="text"
                name="ipaddress"
                id="ipaddress"
                value={ip_address}
                onChange={(e) => setIP(e.target.value)}
                placeholder="IP Address"
                className="form-control"
              />
              {errors.ip_address && (
                <div className="text-danger">{errors.ip_address}</div>
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xl={6}>
              <label>MAC Address:</label>
              <input
                type="text"
                name="mac_address"
                id="mac_address"
                value={mac_address}
                onChange={(e) => setMacAdd(e.target.value)}
                placeholder="MAC Address"
                className="form-control"
              />
              {errors.mac_address && (
                <div className="text-danger">{errors.mac_address}</div>
              )}
            </Col>
            <Col xl={6}>
              <label>Camera MAC Address:</label>
              <input
                type="text"
                name="camera_mac_address"
                id="camera_mac_address"
                value={camera_mac_address}
                onChange={(e) => setCameraMacAdd(e.target.value)}
                placeholder="Camera MAC Address"
                className="form-control"
              />
              {errors.camera_mac_address && (
                <div className="text-danger">{errors.camera_mac_address}</div>
              )}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xl={6}>
              <label>Latitude:</label>
              <input
                type="text"
                name="latitude"
                id="latitude"
                value={latitude}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                className="form-control"
              />
              {errors.latitude && (
                <div className="text-danger">{errors.latitude}</div>
              )}
            </Col>
            <Col xl={6}>
              <label>Longitude:</label>
              <input
                type="text"
                name="longitude"
                id="longitude"
                value={longitude}
                onChange={(e) => setLong(e.target.value)}
                placeholder="Longitude"
                className="form-control"
              />
              {errors.longitude && (
                <div className="text-danger">{errors.longitude}</div>
              )}
            </Col>
          </Row>
          {errors.global && (
            <div className="text-danger mt-2">{errors.global}</div>
          )}
          <Row className="mt-4">
            <Col xl={6}>
              <button className="col-md-12 btn btn-success" onClick={saveInfo}>
                Save
              </button>
            </Col>
            <Col xl={6}>
              <button
                className="col-md-12 btn btn-danger"
                onClick={() => {
                  tog_backdrop();
                }}
              >
                Close
              </button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={6}>
                      <h5 className="card-title mb-0">Manage Devices</h5>
                    </Col>
                    <Col lg={6}>
                      <h5 className="card-title mb-0 float-end">
                        <Icon
                          icon="ri:add-box-line"
                          color="light"
                          width="30"
                          height="30"
                          style={{ cursor: "pointer" }}
                          onClick={() => updateFields(true, {})}
                        />
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Title</th>
                          <th scope="col">Feeder ID</th>
                          <th scope="col">Location</th>
                          <th scope="col">MAC Address</th>
                          <th scope="col">Camera MAC Address</th>
                          <th scope="col">Creation Date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((val, i) => (
                            <tr key={i}>
                              <td>{val.id}</td>
                              <td>{val.title}</td>
                              <td>{val.feeder_id}</td>
                              <td>{val.location}</td>
                              <td>{val.mac_address}</td>
                              <td>{val.camera_mac_address}</td>
                              <td>
                                {moment(val.createdAt).format(
                                  "YYYY-MM-DD h:mm:ss a"
                                )}
                              </td>
                              <td>
                                <div
                                  className="form-check form-switch form-switch-sm float-right"
                                  dir="ltr"
                                >
                                  <Input
                                    type="checkbox"
                                    onChange={(e) =>
                                      updateStatus(val.id, e.target.checked)
                                    }
                                    defaultChecked={val.status}
                                    className="form-check-input"
                                    id="customSwitchsizelg"
                                  />
                                </div>
                              </td>
                              <td>
                                <Icon
                                  icon="ri:edit-fill"
                                  className="float-right"
                                  color="#a33"
                                  width="20"
                                  height="20"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => updateFields(false, val)}
                                />
                                &nbsp;&nbsp;
                                <Icon
                                  icon="ri:delete-bin-5-line"
                                  className="float-right"
                                  color="#a33"
                                  width="20"
                                  height="20"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => deleteFeeder(val)}
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} align="center">
                              No Devices Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ManageBirdFeedDevices;
