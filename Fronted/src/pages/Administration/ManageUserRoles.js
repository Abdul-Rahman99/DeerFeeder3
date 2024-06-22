
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, Progress, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from 'reactstrap';

const ManageuserRoles = () => {
    document.title = "Manage User Roles";
    const [userData, setData] = useState([])
    const [roleData, setRole] = useState([])

    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        axios.get(api.API_URL + "/api/getUserRole")
            .then(res => {
                if (res && res.status == true)
                    console.log(res);
                setData(res.Users)
                setRole(res.Roles)
            })
            .catch(err => console.log(err))
    }

    const assignRole = async (userId, roleId, checked) => {
        try {
            const statusToSend = checked ? 1 : 0;

            // Call your API to update the user's roles with the statusToSend
            const response = await axios.post('/api/assignRole', {
                userId,
                roleId,
                status: statusToSend,
            });

            if (response.status) {
                toast("Role successfully assigned", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })

                updateData()
            } else {
                toast("Role assignment is failed", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
            }
        } catch (error) {
            // Handle error
            console.error('Error assigning role', error);
        }
    };

    return (
        <React.Fragment>
            <ToastContainer />

            <div className="page-content">
                <Container fluid>

                    <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Manage User Roles</h5>
                                        </Col>

                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">User</th>
                                                    <th scope="col">Roles</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userData && userData.length > 0 ? (
                                                    userData.map((user, userIndex) => (
                                                        <tr key={userIndex}>
                                                            <td>{user.first_name} {user.last_name} ({user.email}) </td>
                                                            <td>
                                                                {roleData && roleData.length > 0 ? (
                                                                    <div>
                                                                        {roleData.map((role, roleIndex) => (
                                                                            <span key={roleIndex}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={`checkbox-${user.id}-${role.id}`}
                                                                                    onChange={(e) => assignRole(user.id, role.id, e.target.checked)}
                                                                                    checked={user.role_ids?.split(',').includes(String(role.id))}
                                                                                />
                                                                                <label htmlFor={`checkbox-${user.id}-${role.id}`}>{role.name}</label>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : null}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} align="center">No Record Found</td>
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
        </React.Fragment >
    );
};

export default ManageuserRoles