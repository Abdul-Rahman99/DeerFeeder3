import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import CountUp from "react-countup";
import { DefaultTable, PaginationTable, SearchTable, SortingTable, LoadingStateTable, HiddenColumns } from './ReactTable'
import { Basic } from "./BarCharts";
import { BasicColumn } from "./ColumnCharts";

const mapStyles = {
    width: '100%',
    height: '100%',
};
const LoadingContainer = () => <div>Loading...</div>

const FeedSpecies = (props) => {
    document.title = "Birds Analysis";
    const DubaiCoordinates = { lat: 25.207964, lng: 55.265867 };
    const DubaiCoordinates_1 = { lat: 25.207653, lng: 55.290286 };
    const DubaiCoordinates_2 = { lat: 25.181131, lng: 55.252864 };

    const [tableData, setData] = useState([])
    const [birdsTableData, setAllBirdsData] = useState([])
    useEffect(() => {
        getAllBirdsData()
    }, [])
    const getAllBirdsData = () => {
        axios.get(api.API_URL + "/api/getAllBirdsData")
            .then(res => {
                setAllBirdsData(res.data)
            })
            .catch(err => console.log(err))
    }
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
                        <Col lg={12} style={{ marginBottom: "20px" }}>
                            <Card>
                                <CardHeader>
                                    <h5 className="card-title mb-0">Birds Data</h5>
                                </CardHeader>
                                <CardBody>
                                    <SearchTable tableData={birdsTableData || []} />
                                </CardBody>
                            </Card>
                        </Col>
                        {/* <Col lg={12}>
                            <Card>
                                <CardBody className="text-center">
                                    <h4>Page is Under Development</h4>
                                </CardBody>
                            </Card>
                        </Col> */}
                    </Row>
                    {/* 
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
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <h4 className="card-title mb-0">Map</h4>
                                </CardHeader>
                                <CardBody>

                                    <div id="gmaps-markers" className="gmaps" style={{ position: "relative" }}>
                                        <Map
                                            google={props.google}
                                            zoom={12}
                                            style={mapStyles}
                                            initialCenter={DubaiCoordinates}
                                        >
                                            <Marker position={DubaiCoordinates} />
                                            <Marker position={DubaiCoordinates_1} />
                                            <Marker position={DubaiCoordinates_2} />
                                        </Map>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}

                </Container>
            </div>
        </React.Fragment>
    );
};


export default (
    GoogleApiWrapper({
        apiKey: "AIzaSyB7Bl8P6ChKx_l1OWR5aKT4l_h0NOhwXo4",
        LoadingContainer: LoadingContainer,
        v: "3",
    })(FeedSpecies)
)