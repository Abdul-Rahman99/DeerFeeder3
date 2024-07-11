import { Col, Row } from 'reactstrap';
import React from "react";

import { AverageBirdsCount } from './AverageBirdsCount';
import { FeedConsumption } from './FeedConsumption';
import { ChartsProvider } from './ChartsProvider';
import BirdsSpecies from './BirdsSpecies';

export const Charts = ({currentFeederId}) => (
    <ChartsProvider currentFeederId={currentFeederId}>
        <FeedConsumption />
        <AverageBirdsCount />
        <BirdsSpecies />
    </ChartsProvider>
);