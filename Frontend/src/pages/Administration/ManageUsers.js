

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { api } from "../../config";
import { Icon } from '@iconify/react';
import moment from "moment/moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, Card, CardBody, CardHeader, Col, Container, Button, Row, Label, Form, FormFeedback, Input, Modal, Progress, ModalBody, ModalHeader, ModalFooter, Table, Spinner } from 'reactstrap';

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

axios.defaults.withCredentials = true;

var mySelected = []
const ManageUsers = () => {
    document.title = "Manage Users";
    const [tableData, setData] = useState([])
    const [errors, setErrors] = useState()

    const [feedDevices, setFeedDevices] = useState([])
    const [feeddevice, setFeedDevice] = useState()
    const [userTypes, setAllUserTypes] = useState([])
    const [feederIds, setFeederIds] = useState('');
    const [selectedMulti, setselectedMulti] = useState(null);

    const [isNew, setIsNew] = useState(true)

    const [id, setId] = useState(0)
    const [fname, setFname] = useState()
    const [lname, setLname] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [cpassword, setCPassword] = useState()
    const [username, setUsername] = useState()
    const [userType, setUserType] = useState()
    const [feederId, setFeederId] = useState()


    const [modal_backdrop, setmodal_backdrop] = useState(false);
    const [modal_password, setmodal_Password] = useState(false);
    const [modal_AddFeeder, setmodal_addfeeder] = useState(false);


    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }
    function tog_password(val) {
        if (val)
            setId(val.id);
        setmodal_Password(!modal_password);
    }

    const [allChecked, setAllChecked] = useState(false)

    function addDevices(val) {
        // console.log(val);
        if (val) {
            setId(val);
            axios.get(api.API_URL + "/api/getUserDevices/" + val)
                .then(res => {
                    if (res && res.status === true) {
                        setFeederIds(res.data);
                        const assignedDevicesArray = res.data.split(","); // "1,2,3,4,5,6"

                        const totalFeederDevices = feedDevices.length;

                        const allDevicesAssigned = assignedDevicesArray.length === totalFeederDevices;

                        setAllChecked(allDevicesAssigned);

                    } else {

                        toast(res.message, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })

                    }
                })
                .catch((err) => {

                    console.log(err)
                    setAllChecked(false);
                });
            setmodal_addfeeder(!modal_AddFeeder);
        } else {
            setFeederIds('');
            setmodal_addfeeder(!modal_AddFeeder);
        }
    }

    const assignDevice = async (userId, deviceId, checked) => {


        try {
            const statusToSend = checked ? 1 : 0;
            const response = await axios.post('/api/assignDevice', {
                userId,
                deviceId,
                status: statusToSend,
            });

            if (response.status) {
                setFeederIds(response.data);

                const assignedDevicesArray = response.data.split(","); // "1,2,3,4,5,6"

                const totalFeederDevices = feedDevices.length;

                const allDevicesAssigned = assignedDevicesArray.length === totalFeederDevices;

                setAllChecked(allDevicesAssigned);

                toast(response.message, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
            } else {
                toast("Device assignment is failed", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
            }
        } catch (error) {
            // Handle error
            console.error('Error assigning role', error);
        }
    };







    function handleMulti(selectedMulti) {
        setselectedMulti(selectedMulti);
    }
    useEffect(() => {
        getFeedDevices()
        getUserTypes()
        updateData()
    }, [])

    const getFeedDevices = () => {
        axios.get(api.API_URL + "/api/getDevices")
            .then(res => {
                if (res && res.status == true)
                    setFeedDevices(res.data)

            })
            .catch(err => console.log(err))
    }
    const getUserTypes = () => {
        axios.get(api.API_URL + "/api/getUserTypes")
            .then(res => {
                if (res && res.status == true)
                    setAllUserTypes(res.data)
            })
            .catch(err => console.log(err))

    }

    const updateData = () => {
        axios.get(api.API_URL + "/api/getUsers")
            .then(res => {
                if (res && res.status == true) {
                    setData(res.data)
                    //setselectedMulti(res.data.UserDevices)
                }
            })
            .catch(err => console.log(err))
    }
    const updateUserStatus = (id, is_enabled) => {

        axios.post(api.API_URL + "/api/updateUserStatus", { id, status: is_enabled })
            .then(res => {
                if (res && res.status == true) {

                    updateData()
                    toast("Status Updated Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });

                } else {
                    setErrors(res);
                    console.log("users", "0", res)
                }
            }).catch(err => {
                setErrors(err);
                console.log("users", "1", err)
            })
    }

    // const deleteUser = async (val) => {
    //     if (window.confirm('Are you sure you wish to delete?')) {
    //         axios.delete(api.API_URL + "/api/deleteUser/" + val.id)
    //             .then(res => {
    //                 if (res && res.status == true) {
    //                     toast("User Deleted Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' })
    //                     updateData()
    //                 } else {
    //                     setErrors(res);
    //                     console.log("users", "0", res)
    //                 }
    //             }).catch(err => {
    //                 setErrors(err);
    //                 console.log("users", "1", err)
    //             })
    //     }
    // }
    const deleteUser = async (val) => {
        if (window.confirm('Are you sure you wish to delete?')) {
            try {
                const res = await axios.delete(`${api.API_URL}/api/deleteUser/${val.id}`);
                if (res && res.data.status === true) {
                    toast("User Deleted Successfully", { 
                        position: "top-right", 
                        hideProgressBar: true, 
                        closeOnClick: false, 
                        className: 'bg-success text-white' 
                    });
                    updateData();
                } else {
                    setErrors(res.data);
                    console.log("users", "0", res.data);
                }
                updateData();
            } catch (err) {
                setErrors(err);
                console.log("users", "1", err);
            }
        }
    }
    
    const updateFields = (isNew, val) => {
        setselectedMulti(null);
        setIsNew(isNew);
        if (isNew) {
            setId(0);
            setFname("");
            setLname("");
            setEmail("");
            setPassword("");
            setUsername("");
            setFeederId("");
            setUserType("");
        }
        else {
            setId(val.id);
            setFname(val.first_name);
            setLname(val.last_name);
            setEmail(val.email);
            setUsername(val.username);
            setFeederId(val.feeder_id);
            setUserType(val.usertype_id);

            let list = val.UserDevices.map(d => { return { value: d.feeder_id, label: d?.FeedingDevice?.title } })

            setselectedMulti(list);
        }

        tog_backdrop()
    }

    const mainFormValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: email,
            fname: fname,
            lname: lname,
            password: password,
            confirm_password: cpassword,
            username: username
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('Please enter a valid email address')
                .required('Please enter your email'),
            fname: Yup.string().required('Please enter your first name'),
            lname: Yup.string().required('Please enter your last name'),
            username: Yup.string().required('Please enter your user name'),
            ...(!isNew
                ? {}
                : {
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                    confirm_password: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm password is required'),
                }),
        }),
        onSubmit: (value) => {
            console.log('aaaaaaaaaaaaaaaaaaa')
            const obj = {

                isNew: isNew,
                id: id,
                fname: value.fname,
                lname: value.lname,
                email: value.email,
                username: value.username,
                password: value.password || password,
                userType: userType,
                feederId: 1,
                selectedMulti: selectedMulti
            }
            axios.post(api.API_URL + "/api/addUser", obj)
                .then(res => {
                    if (res && res.status == true) {
                        tog_backdrop()
                        updateData()
                        toast(`User ${isNew ? 'Added' : 'Updated'} Successfully`, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });

                    } else {
                        setErrors(res);
                        console.log("users", "0", res)
                    }
                }).catch(err => {
                    setErrors(err);
                    console.log("users", "1", err)
                })

        }
    });


    const pwdValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            password: '',
            confirm_password: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required')
        }),
        onSubmit: (values) => {
            axios.post(api.API_URL + "/api/updatePassword/", { id: id, password: values.password })
                .then(res => {
                    tog_password(null);
                    toast("Password Successfully", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
                })
                .catch(err => {

                    toast("Some thing went wrong", { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });

                })
        }
    });

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
                    {isNew ? 'Add' : 'Update'} User
                </ModalHeader>
                <ModalBody className="p-3">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            mainFormValidation.handleSubmit();
                            return false;
                        }}
                        className="needs-validation" action="#">
                        <Row className="mt-2">
                            <Col md={6}>

                                <Label htmlFor="fname" className="form-label">First Name <span className="text-danger">*</span></Label>
                                <Input
                                    id="fname"
                                    name="fname"
                                    className="form-control"
                                    placeholder="Enter first name"
                                    type="text"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.fname}
                                    invalid={mainFormValidation.touched.fname && mainFormValidation.errors.fname}
                                />
                                {mainFormValidation.touched.fname && mainFormValidation.errors.fname ? (
                                    <FormFeedback type="invalid">{mainFormValidation.errors.fname}</FormFeedback>
                                ) : null}

                            </Col>
                            <Col md={6}>

                                <Label htmlFor="lname" className="form-label">Last Name <span className="text-danger">*</span></Label>
                                <Input
                                    id="lname"
                                    name="lname"
                                    className="form-control"
                                    placeholder="Enter last name"
                                    type="text"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.lname}
                                    invalid={mainFormValidation.touched.lname && mainFormValidation.errors.lname}
                                />
                                {mainFormValidation.touched.lname && mainFormValidation.errors.lname ? (
                                    <FormFeedback type="invalid">{mainFormValidation.errors.lname}</FormFeedback>
                                ) : null}

                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col md={6}>

                                <Label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></Label>
                                <Input
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    type="email"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.email}
                                    invalid={mainFormValidation.touched.email && mainFormValidation.errors.email}
                                />
                                {mainFormValidation.touched.email && mainFormValidation.errors.email ? (
                                    <FormFeedback type="invalid">{mainFormValidation.errors.email}</FormFeedback>
                                ) : null}

                            </Col>
                            <Col md={6}>

                                <Label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></Label>
                                <Input
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    placeholder="Enter username"
                                    type="text"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.username}
                                    invalid={mainFormValidation.touched.username && mainFormValidation.errors.username}
                                />
                                {mainFormValidation.touched.username && mainFormValidation.errors.username ? (
                                    <FormFeedback type="invalid">{mainFormValidation.errors.username}</FormFeedback>
                                ) : null}

                            </Col>
                        </Row>
                        <Row className="mt-2" style={{ display: isNew ? 'flex' : 'none' }}>
                            <Col md={6}>
                                <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.password || ""}
                                    invalid={
                                        mainFormValidation.touched.password && mainFormValidation.errors.password ? true : false
                                    }
                                />
                                {mainFormValidation.touched.password && mainFormValidation.errors.password ? (
                                    <FormFeedback type="invalid"><div>{mainFormValidation.errors.password}</div></FormFeedback>
                                ) : null}


                            </Col>  <Col xl={6}>

                                <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                <Input
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Confirm password"
                                    onChange={mainFormValidation.handleChange}
                                    onBlur={mainFormValidation.handleBlur}
                                    value={mainFormValidation.values.confirm_password || ""}
                                    invalid={
                                        mainFormValidation.touched.confirm_password && mainFormValidation.errors.confirm_password ? true : false
                                    }
                                />
                                {mainFormValidation.touched.confirm_password && mainFormValidation.errors.confirm_password ? (
                                    <FormFeedback type="invalid"><div>{mainFormValidation.errors.confirm_password}</div></FormFeedback>
                                ) : null}


                            </Col>
                        </Row>

                        {/* <Row className="mt-2">
                            <Col xl={6}>
                                <label>Feeder Device:</label>
                                <Select
                                    value={selectedMulti}
                                    isMulti
                                    onChange={(selectedOptions) => handleMulti(selectedOptions)}
                                    options={feedDevices.map(device => ({ value: device.id, label: device.title }))}
                                />


                            </Col>
                            <Col xl={6}>
                                <label>User Type:</label>
                                <select onChange={(e) => setUserType(e.target.value)} id="usertype" name="usertype" className="form-control" >
                                    <option value={""}>User Type</option>
                                    {
                                        userTypes.map((val, id) => {
                                            return (<option key={id} selected={val.id == userType ? "selected" : ""} value={val.id}>{val.title}</option>)
                                        })
                                    }
                                </select>
                            </Col>
                        </Row> */}
                        <Row className="mt-4">
                            {errors ?
                                <Col xl={12} >
                                    <div className="alert alert-danger">
                                        {errors}
                                    </div>
                                </Col>
                                : ("")}
                        </Row>
                        <Row className="mt-4">
                            <Col xl={6}>
                                <Button className="col-md-12 btn btn-success" type="submit">Save</Button>

                            </Col>
                            <Col xl={6}>
                                <button type="button" className="col-md-12 btn btn-danger" onClick={() => {
                                    tog_backdrop(null);
                                }}>Close</button>
                            </Col>
                        </Row>


                    </Form>
                </ModalBody>
            </Modal>
            {/* {password modal} */}
            <Modal
                isOpen={modal_password}
                toggle={() => {
                    tog_password(null);
                }}
                backdrop={'static'}
                id="staticPassword"
                centered
            >
                <ModalHeader className="modal-title" id="staticPassword" toggle={() => {
                    tog_password(null);
                }}>
                    Update Password
                </ModalHeader>
                <ModalBody className="p-3">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            pwdValidation.handleSubmit();
                            return false;
                        }}
                        className="needs-validation" action="#">
                        <Row className="mt-2">

                            <Col xl={6}>  <div className="mb-3">
                                <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={pwdValidation.handleChange}
                                    onBlur={pwdValidation.handleBlur}
                                    value={pwdValidation.values.password || ""}
                                    invalid={
                                        pwdValidation.touched.password && pwdValidation.errors.password ? true : false
                                    }
                                />
                                {pwdValidation.touched.password && pwdValidation.errors.password ? (
                                    <FormFeedback type="invalid"><div>{pwdValidation.errors.password}</div></FormFeedback>
                                ) : null}

                            </div> </Col>
                            <Col xl={6}>
                                <div className="mb-2">
                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                    <Input
                                        name="confirm_password"
                                        type="password"
                                        placeholder="Confirm password"
                                        onChange={pwdValidation.handleChange}
                                        onBlur={pwdValidation.handleBlur}
                                        value={pwdValidation.values.confirm_password || ""}
                                        invalid={
                                            pwdValidation.touched.confirm_password && pwdValidation.errors.confirm_password ? true : false
                                        }
                                    />
                                    {pwdValidation.touched.confirm_password && pwdValidation.errors.confirm_password ? (
                                        <FormFeedback type="invalid"><div>{pwdValidation.errors.confirm_password}</div></FormFeedback>
                                    ) : null}

                                </div> </Col>

                        </Row>
                        <Row className="mt-4">
                            <Col xl={6}>
                                <Button className="col-md-12 btn btn-success" type="submit">Save</Button>

                            </Col>
                            <Col xl={6}>
                                <button className="col-md-12 btn btn-danger" onClick={() => {
                                    tog_password(null);
                                }}>Close</button>
                            </Col>
                        </Row>
                    </Form>

                </ModalBody>
            </Modal>

            {/* {Add Feeder modal} */}
            <Modal
                isOpen={modal_AddFeeder}
                toggle={() => {
                    tog_password(null);
                }}
                backdrop={'static'}
                id="staticPassword"
                centered
                size="md"
                style={{ maxWidth: '75%', width: 'auto' }}
            >
                <ModalHeader className="  modal-title  " id="staticPassword" toggle={() => {
                    addDevices(null);
                }}>
                    <div className="d-flex">
                        <div>Assign Devices</div>
                        <div className="px-3 ">
                            <input
                                className="ml-3 pl-3"
                                type="checkbox"
                                id="checkbox-all"
                                label="Check all Devices"
                                onChange={(e) => assignDevice(id, 0, e.target.checked)}
                                checked={allChecked}
                            />
                            <label htmlFor={`checkbox-all`}>Check all Devices </label>
                        </div></div>
                </ModalHeader>
                <ModalBody className="p-3">
                    <Row className="mt-2">
                        {feedDevices.map(device => (
                            <Col key={device.id} xl={4}>
                                <div className="mb-4">
                                    <span key={device.id}>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${id}-${device.id}`}
                                            onChange={(e) => assignDevice(id, device.id, e.target.checked)}
                                            checked={feederIds && feederIds?.split(',').includes(String(device.id))}
                                        />
                                        <label htmlFor={`checkbox-${id}-${device.id}`}>{device.title}({device.location})</label>
                                    </span>
                                </div>
                            </Col>
                        ))}

                    </Row>
                </ModalBody>
            </Modal>




            <div className="page-content">
                <Container fluid>
                    {/* {JSON.stringify(tableData)} */}
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Manage Users</h5>
                                        </Col>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0 float-end">
                                                <Icon icon="ri:add-box-line" color="light" width="30" height="30" style={{ cursor: "pointer" }} onClick={() => updateFields(true, {})} />
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
                                                    <th scope="col">Full Name</th>
                                                    <th scope="col">User Email</th>
                                                    {/* <th scope="col">Feeder Device</th> */}
                                                    <th scope="col">User Name</th>
                                                    {/* <th scope="col">User Type</th> */}
                                                    <th scope="col">Creation Date</th>
                                                    <th scope="col">Can Login</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (tableData && Object.keys(tableData).length > 0) ?
                                                        (tableData.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{val.first_name} {val.last_name}</td>
                                                                    <td>{val.email}</td>
                                                                    {/* <td>{val.UserDevices ? JSON.stringify(val.UserDevices) : ""}</td> */}
                                                                    <td>{val.username}</td>
                                                                    {/* <td>{val.UserType.title}</td> */}
                                                                    <td>{moment(val.createdAt).format('YYYY-MM-DD h:mm:ss a')}</td>
                                                                    <td>
                                                                        <div className="form-check form-switch form-switch-sm float-right" dir="ltr">
                                                                            <Input type="checkbox" onChange={(e) => updateUserStatus(val.id, e.target.checked)} defaultChecked={val.status} className="form-check-input" id="customSwitchsizelg" />
                                                                        </div>
                                                                    </td>
                                                                    <td>

                                                                        <Icon icon="ri:device-line" className="float-left" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => addDevices(val.id)} />
                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:lock-unlock-line" color="#33a" width="20" height="20" className="float-right" style={{ cursor: "pointer" }} onClick={() => tog_password(val)} />
                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:edit-fill" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => updateFields(false, val)} />

                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:delete-bin-5-line" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => deleteUser(val)} />


                                                                    </td>
                                                                </tr>

                                                            )
                                                        })) : <tr><td colSpan={8} align="center">No Users Found</td></tr>
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

export default ManageUsers