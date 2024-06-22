import { Col, Row, Card, Button, Spinner, CardBody, CardHeader } from 'reactstrap';
import React, { useContext } from "react";
import Flatpickr from "react-flatpickr";
import moment from "moment/moment";

import { ImagesChart } from "../../ScatterCharts";
import { ChartsContext } from './ChartsProvider';



export const AverageBirdsCount = () => {
    const {
        myGraphLoader,
        getExportedData,
        birdsDataForGraph,
        dateRangeBirdsNew,
        getBirdsDataForGraph,
        setDateRangeBirdsNew,
        setFilterTypeBirdsNew,
        setUpDefaultDateRange,
    } = useContext(ChartsContext)

    return (
        <Row>
            <Col lg={12}>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col lg={4}>
                                <h5 className="card-title mb-0">Average Birds Count</h5>
                            </Col>
                            <Col lg={8} style={{ float: "right" }}>
                                <Row onLoad={setUpDefaultDateRange}>
                                    <Col xl={6}>
                                        <div className="input-group">
                                            <Flatpickr
                                                className="form-control"
                                                options={{
                                                    dateFormat: "Y-m-d",
                                                    defaultDate: dateRangeBirdsNew ? [dateRangeBirdsNew] : [moment().format("YYYY-MM-DD")]
                                                }}
                                                onChange={setDateRangeBirdsNew}
                                            />
                                            <div className="input-group-text bg-dark border-dark text-white"><i className="ri-calendar-2-line"></i></div>
                                        </div>
                                    </Col>
                                    <Col xl={4}>
                                        <div className="input-group">
                                            <select className="form-select" onChange={({target: {value}}) => setFilterTypeBirdsNew(value)}>
                                                <option value={"Daily"}>Days</option>
                                                <option value={"Weekly"}>Weekly</option>
                                                <option value={"Monthly"}>Monthly</option>
                                                <option value={"Yearly"}>Yearly</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col xl={1}>
                                        {
                                            myGraphLoader
                                            ? <Spinner color="light"></Spinner>
                                            : <Button color="primary" className="btn-icon" onClick={getBirdsDataForGraph}> <i className="ri-filter-line" /></Button>
                                        }
                                    </Col>
                                    <Col xl={1}>
                                        <Button color="primary" className="btn-icon" onClick={getExportedData}> <i className="ri-file-excel-2-fill" /></Button>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <ImagesChart
                            BirdsDataForGraph={birdsDataForGraph}
                            dataColors='["--vz-primary", "--vz-success", "--vz-warning"]'
                        />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};