import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { ConnectivityDevices } from "../../common/data";

const BestSellingProducts = () => {
    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Device Connectivity</h4>
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                                <thead>
                                    <tr>
                                        <th>Device</th>
                                        <th>Temperature</th>
                                        <th>Battery Voltage</th>
                                        <th>S.Panel Voltage</th>
                                        <th>Connect</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(ConnectivityDevices || []).map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <i className='ri ri-cpu-line'></i>
                                                        <h5 className="fs-14 my-1">{item.label}</h5>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">{item.price}</h5>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">{item.orders}</h5>
                                            </td>
                                            <td>
                                                <h5 className="fs-14 my-1 fw-normal">{item.stock} </h5>
                                            </td>
                                            <td>
                                                <i className={item.icon}></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
                            <div className="col-sm">
                                <div className="text-muted">Showing <span className="fw-semibold">5</span> of <span className="fw-semibold">25</span> Results
                                </div>
                            </div>
                            <div className="col-sm-auto mt-3 mt-sm-0">
                                <ul className="pagination pagination-separated pagination-sm mb-0">
                                    <li className="page-item disabled">
                                        <Link to="#" className="page-link">←</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">1</Link>
                                    </li>
                                    <li className="page-item active">
                                        <Link to="#" className="page-link">2</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">3</Link>
                                    </li>
                                    <li className="page-item">
                                        <Link to="#" className="page-link">→</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </CardBody>
                </Card>
            </Col>
        </React.Fragment >
    );
};

export default BestSellingProducts;