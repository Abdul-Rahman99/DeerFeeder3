

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from './ReactTable'
const FeedSetting = () => {
    document.title = "Feed Settings";
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

                    <Row>

                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">MQTT Arrived Data</h5>
                                </CardHeader>
                                <CardBody>
                                    <SearchTable tableData={tableData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FeedSetting