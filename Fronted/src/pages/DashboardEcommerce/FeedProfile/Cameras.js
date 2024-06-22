import { Col, Row, Card, Spinner, CardBody, CardHeader } from 'reactstrap';
import React from "react";

import { api } from '../../../config';

const ShowImage = ({ camPic }) => {
    if (camPic == 0) {
        return <div className="d-flex justify-content-center">
            <Spinner color="light" className='me-2'> Loading... </Spinner>
        </div>
    } else if (camPic != "undefined") {
        return <img src={api.API_URL + '/' + camPic} className={"card-img-top"} style={{ width: "100%" }} />
    } else
        return null
}

export const Cameras = ({camPic, camPic2}) => {
    return (
        <Row>
            <Col lg={6}>
                <Card className="myCards">
                    <CardHeader>
                        <h5 className="card-title mb-0">Camera1</h5>
                    </CardHeader>
                    <CardBody>
                        <ShowImage camPic={camPic} />
                    </CardBody>
                </Card>
            </Col>

            <Col lg={6}>
                <Card className="myCards">
                    <CardHeader>
                        <h5 className="card-title mb-0">Camera2</h5>
                    </CardHeader>
                    <CardBody>
                    <ShowImage camPic={camPic2} />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};