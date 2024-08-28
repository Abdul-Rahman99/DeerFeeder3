import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import React, { useContext } from "react";

import { ChartsContext } from "./ChartsProvider";
import { SimplePie2 } from "../../PieCharts";

const BirdsSpecies = () => {
  const { birdsPieDataForGraph } = useContext(ChartsContext);

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0">Deer Species</h4>
          </CardHeader>
          <CardBody>
            <SimplePie2
              myData={birdsPieDataForGraph}
              dataColors='["--vz-success", "--vz-warning", "--vz-danger"]'
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BirdsSpecies;
