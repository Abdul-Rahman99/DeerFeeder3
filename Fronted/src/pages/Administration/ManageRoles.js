

import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { api } from "../../config";
import { Icon } from '@iconify/react';
import moment from "moment/moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, Progress, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from 'reactstrap';

const ManageRoles = () => {
    document.title = "Manage Roles";
    const [tableData, setData] = useState([])
    const [rolePermissions, setRolePermissions] = useState([])
    const [isNew, setIsNew] = useState(true)
    const [name, setName] = useState()
    const [definition, setDefinition] = useState()
    const [errors, setErrors] = useState()
    const [modal_assignpermission, setmodal_assignpermission] = useState(false);
    const [permissionIds, setPermissionIds] = useState('');
    const [id, setId] = useState(null)


    useEffect(() => {
        updateData()
    }, [])

    const saveInfo = () => {
        axios.post(api.API_URL + "/api/addRole", { isNew, id, name, definition })
            .then(res => {
                if (res && res.status == true) {
                    tog_backdrop()
                    updateData()
                    toast(`Role ${isNew ? 'Added' : 'Updated'} Successfully`, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })

                }
            }).catch(err => {

            })
    }

    const updateData = () => {
        axios.get(api.API_URL + "/api/getRoles")
            .then(res => {
                if (res && res.status == true)
                    setData(res.data)
            })
            .catch(err => console.log(err))
    }
    const deleteRole = async (val) => {
        if (window.confirm('Are you sure you wish to delete?')) {
            axios.delete(api.API_URL + "/api/deleteRole/" + val)
                .then(res => {
                    if (res && res.status == true) {
                        toast("Role Deleted Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })

                        updateData()
                    } else {
                        setErrors(res);
                        console.log("roles", "0", res)
                    }
                }).catch(err => {
                    setErrors(err);
                    console.log("roles", "1", err)
                })
        }
    }

    const updateFields = (isNew, val) => {
        setIsNew(isNew)
        if (isNew) {
            setName("")
            setDefinition("")
            setId(0)
        }
        else {
            setName(val.name)
            setDefinition(val.definition)
            setId(val.id)
        }

        tog_backdrop()
    }
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }

    const assignDevice = async (roleId, permId, checked) => {
        try {
            const statusToSend = checked ? 1 : 0;
            const response = await axios.post('/api/assignPerm', {
                roleId,
                permId,
                status: statusToSend,
            });

            if (response.status) {
                setPermissionIds(response.data);
                toast(response.message, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
            } else {
                toast("Device assignment is failed", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
            }
        } catch (error) {
            // Handle error
            console.error('Error assigning role', error);
        }
    };

    function assignPermissions(val) {
        console.log(val);
        if (val) {
            setId(val);
            axios.get(api.API_URL + "/api/getRolePerms/" + val)
                .then(res => {
                    if (res && res.status === true) {
                        console.log(res);
                        setPermissionIds(res.permissionIds);
                        setRolePermissions(res.data);
                    } else {
                        toast(res.message, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })

                    }
                })
                .catch(err => console.log(err));
            setmodal_assignpermission(!modal_assignpermission);
        } else {
             setPermissionIds('');
            setmodal_assignpermission(!modal_assignpermission);
        }
    }

    return (
        <React.Fragment>
            <ToastContainer />
            {/* Static Backdrop Modal */}
            <Modal
                isOpen={modal_backdrop}
                toggle={() => {
                    tog_backdrop();
                }}
                backdrop={'static'}
                id="staticBackdrop"
                centered
            >
                <ModalHeader className="modal-title" id="staticBackdropLabel" toggle={() => {
                    tog_backdrop();
                }}>
                    {isNew ? 'Add' : 'Update'} Role
                </ModalHeader>
                <ModalBody className="p-3">
                    <Row className="mt-2">
                        <Col xl={12}>
                            <label>Name:</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="form-control" />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col xl={12}>
                            <label>Definition:</label>
                            <input type="text" name="definition" id="definition" value={definition} onChange={(e) => setDefinition(e.target.value)} placeholder="Definition" className="form-control" />
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xl={6}>
                            <button className="col-md-12 btn btn-success" onClick={saveInfo}>Save</button>

                        </Col>
                        <Col xl={6}>
                            <button className="col-md-12 btn btn-danger" onClick={() => {
                                tog_backdrop();
                            }}>Close</button>
                        </Col>
                    </Row>


                </ModalBody>
            </Modal>
            {/* {Add Assign Permission modal} */}
            <Modal
                isOpen={modal_assignpermission}
                toggle={() => {
                    assignPermissions(null);
                }}
                backdrop={'static'}
                id="staticPassword"
                centered
                size="md"
                style={{ maxWidth: '75%', width: 'auto' }}
            >
                <ModalHeader className="modal-title" id="staticPassword" toggle={() => {
                    assignPermissions(null);
                }}>
                    Assign Permissions
                </ModalHeader>
                <ModalBody className="p-3">
                    <Row className="mt-2">
                        {rolePermissions.map(device => (
                            <Col key={device.id} xl={4}>
                                <div className="mb-4">
                                    <span key={device.id}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${id}-${device.id}`}
                                            onChange={(e) => assignDevice(id, device.id, e.target.checked)}
                                            checked={permissionIds && permissionIds?.split(',').includes(String(device.id))}
                                        />
                                        <label htmlFor={`checkbox-${id}-${device.id}`}>{device.name}</label>
                                    </span>
                                </div>
                            </Col>
                        ))}

                    </Row>
                </ModalBody>
            </Modal>
            {/*  */}
            <div className="page-content">
                <Container fluid>

                    <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Manage Roles</h5>
                                        </Col>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0 float-end">
                                                <Icon icon="ri:add-box-line"  color="light"  width="30" height="30" style={{ cursor: "pointer" }} onClick={() => updateFields(true, {})} />
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
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Definition</th>
                                                    <th scope="col">Assign Permission</th>
                                                    <th scope="col">Creation Date</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (tableData && Object.keys(tableData).length > 0) ?
                                                        (tableData.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{val.id}</td>
                                                                    <td>{val.name}</td>
                                                                    <td>{val.definition}</td>
                                                                    <td>
                                                                        {/* <Link to={`/assign-permissions/${val.id}`}>Add Permissions</Link> */}
                                                                        <Icon icon="ri:add-box-fill" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => assignPermissions(val.id)} />
                                                                    </td>
                                                                    <td>{moment(val.createdAt).format('YYYY-MM-DD h:mm:ss a')}</td>
                                                                    <td>

                                                                        <Icon icon="ri:edit-fill" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => updateFields(false, val)} />
                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:delete-bin-5-line" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => deleteRole(val.id)} />

                                                                    </td>
                                                                </tr>

                                                            )
                                                        })) : <tr><td colSpan={8} align="center">No Role Found</td></tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default ManageRoles