

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { Icon } from '@iconify/react';
import moment from "moment/moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, CardBody, CardHeader, Col, Container, Row, Label, Input, Modal, Progress, ModalBody, ModalHeader, ModalFooter, Table, Pagination, PaginationItem, PaginationLink, Spinner } from 'reactstrap';

import YourPaginationComponent from './YourPaginationComponent'; // Adjust the path based on your project structure


const ManageUsers = () => {
    document.title = "Manage Deers";
    const [tableData, setData] = useState([])
    const [feedDevices, setFeedDevices] = useState([])
    const [totalRows, setTotalRows] = useState([])
    const [totalPages, setTotalPages] = useState([])


    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        //  getFeedDevices()
        updateData()
    }, [])

    const getFeedDevices = () => {
        axios.get(api.API_URL + "/api/getBirdsDataForAdmin")
            .then(res => {
                if (res && res.status == true)
                    setFeedDevices(res.data)
            })
            .catch(err => console.log(err))

    }
    const [title, setTitle] = useState()
    const saveInfo = () => {
        axios.post(api.API_URL + "/api/addUserType", { title })
            .then(res => {
                if (res && res.status == true) {
                    tog_backdrop()
                    updateData()
                }
            }).catch(err => {

            })
    }

    const updateData = () => {
        axios.get(api.API_URL + "/api/getBirdsDataForAdmin/" + currentPage)
            .then(res => {
                if (res && res.status == true) {
                    setData(res.data)
                    setTotalRows(res.totalRows)
                    setTotalPages(res.totalPages)
                }
            })
            .catch(err => console.log(err))
    }
    const updateUser = (id, is_enabled) => {

    }
    const [modal_backdrop, setmodal_backdrop] = useState(false);
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }



    const handlePageChange = async (pageNumber) => {
        // Handle page change logic here (e.g., fetching data for the new page)
        setCurrentPage(pageNumber);
        updateData()
    };

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
                    Add / Update User
                </ModalHeader>
                <ModalBody className="p-3">
                    <Row className="mt-2">
                        <Col xl={12}>
                            <label>Title:</label>
                            <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} placeholder="Ttile" className="form-control" />
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
            {/*  */}
            <div className="page-content">
                <Container fluid>

                    <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col lg={6}>
                                            <h5 className="card-title mb-0">Manage Deers</h5>
                                        </Col>
                                        <Col lg={6}>
                                            {/* <h5 className="card-title mb-0 float-end">
                                                <Icon icon="ri:add-box-line"  color="light"  width="30" height="30" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />
                                            </h5> */}
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-striped table-nowrap align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Topic</th>
                                                    <th scope="col">Deers Count</th>
                                                    <th scope="col">Creation Date</th>
                                                    {/* <th scope="col">Status</th>
                                                    <th scope="col">Actions</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {JSON.stringify(tableData)} */}
                                                {
                                                    (tableData && Object.keys(tableData).length > 0) ?
                                                        (tableData.map((val, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{val.id}</td>
                                                                    <td>{val.client_topic} </td>
                                                                    <td>{val.client_message} </td>
                                                                    <td>{moment(val.createdAt).format('YYYY-MM-DD h:mm:ss a')}</td>
                                                                    {/* <td>
                                                                        <div className="form-check form-switch form-switch-sm float-right" dir="ltr">
                                                                            <Input type="checkbox" onChange={(e) => updateUser(val.id, e.target.checked)} defaultChecked={val.is_enabled} className="form-check-input" id="customSwitchsizelg" />
                                                                        </div>
                                                                    </td> */}
                                                                    {/* <td>
                                                                        <Icon icon="ri:edit-fill" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />
                                                                        &nbsp;
                                                                        &nbsp;
                                                                        <Icon icon="ri:delete-bin-5-line" className="float-right" color="#a33" width="20" height="20" style={{ cursor: "pointer" }} onClick={() => tog_backdrop()} />

                                                                    </td> */}
                                                                </tr>

                                                            )
                                                        })) : <tr><td colSpan={8} align="center">No BIrds Found</td></tr>
                                                }
                                            </tbody>
                                        </Table>
                                        <YourPaginationComponent
                                            totalRows={totalRows}
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />

                                        {/* <Pagination listClassName="justify-content-center" className="pagination-separated mb-0">
                                            <PaginationItem disabled> <PaginationLink to="#"> <i className="mdi mdi-chevron-left" /> </PaginationLink> </PaginationItem>
                                            <PaginationItem active> <PaginationLink to="#"> 1 </PaginationLink> </PaginationItem>
                                            <PaginationItem> <PaginationLink to="#"> 2 </PaginationLink> </PaginationItem>
                                            <PaginationItem> <PaginationLink to="#"> 3 </PaginationLink> </PaginationItem>
                                            <PaginationItem> <PaginationLink to="#"> 4 </PaginationLink> </PaginationItem>
                                            <PaginationItem> <PaginationLink to="#"> 5 </PaginationLink> </PaginationItem>
                                            <PaginationItem> <PaginationLink to="#"> <i className="mdi mdi-chevron-right" /> </PaginationLink> </PaginationItem>
                                        </Pagination> */}
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