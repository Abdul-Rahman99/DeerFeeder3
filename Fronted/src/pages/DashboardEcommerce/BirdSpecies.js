

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import CountUp from "react-countup";
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from './ReactTable'
import { Basic } from "./BarCharts";
import { BasicColumn } from "./ColumnCharts";
const FeedSpecies = () => {
    document.title = "Bird Species";
    const [tableData, setData] = useState([])
    useEffect(() => {
        axios.get(api.API_URL + "/api/getData")
            .then(res => setData(res))
            .catch(err => console.log(err))
    }, [])
    const updateData = () => {
        axios.get(api.API_URL + "/api/getData")
            .then(res => {
                setData(res)
            })
            .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Row >
                        <Col lg={4} style={{ marginBottom: "20px" }}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Bords Counter</h5>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex align-items-center justify-content-center mt-1">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-1"></h4>
                                        <CountUp
                                            start={0}
                                            prefix={""}
                                            suffix={""}
                                            separator={" "}
                                            end={20}
                                            decimals={"0"}
                                            duration={0.2}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={8} style={{ marginBottom: "20px" }}>
                            <Card className="myCards">
                                <CardHeader>
                                    <h5 className="card-title mb-0">Bird Species</h5>
                                </CardHeader>
                                <CardBody>
                                    <DefaultTable tableData={tableData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">Birds Count</h5>
                                </CardHeader>
                                <CardBody>
                                    <BasicColumn dataColors='["--vz-primary", "--vz-success", "--vz-danger"]' />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FeedSpecies