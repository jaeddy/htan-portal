import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Helmet } from 'react-helmet';
import { ScalePropType } from 'victory-core';
import { WPAtlas } from '../types';
import { EntityReport } from '../lib/helpers';
import {
    EntityReportByAttribute,
    computeUniqueAttributeValueCount,
} from '../lib/entityReportHelpers';
import SummaryChart from './SummaryChart';
import Image from 'next/image';
import htanMarkerPaper from '../public/HTAN-Marker-Paper-Table.png';

export interface IHomePropsProps {
    hero_blurb: string;
    cards: any[];
    atlases: WPAtlas[];
    synapseCounts: EntityReport[];
    organSummary: EntityReportByAttribute[];
    assaySummary: EntityReportByAttribute[];
}

function dashboardIcon(text: string, description: string) {
    return (
        <Col key={`icon-${description}`} xs lg="2">
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '60px', lineHeight: '70px' }}>
                    {text}
                </div>
                <div style={{ fontSize: '20px' }}>{description}</div>
            </div>
        </Col>
    );
}

const chartScale: { x: ScalePropType; y: ScalePropType } = {
    x: 'linear',
    y: 'log',
};

// starting from y=1 doesn't work when case count=1.
// so we start from a slightly smaller value for a better bar chart visualization
const minDomain = { y: 0.95 };

function dependentAxisTickFormat(t: number) {
    // only show tick labels for the integer powers of 10
    return _.isInteger(Math.log10(t)) ? t : '';
}

const HomePage: React.FunctionComponent<IHomePropsProps> = ({
    hero_blurb,
    cards,
    synapseCounts,
    atlases,
    organSummary,
    assaySummary,
}) => {
    return (
        <>
            <Jumbotron
                className={'text-center position-relative'}
                style={{ borderRadius: '0px', marginBottom: '0px' }}
            >
                <div
                    className={'position-absolute'}
                    style={{
                        bottom: 10,
                        right: 10,
                        color: '#fff',
                    }}
                >
                    <a style={{ color: 'white' }} href="/data-updates">
                        Data Release V3 (Last updated 2023-04-14)
                    </a>
                </div>
                <Row className="justify-content-md-center">
                    <Col
                        md={{ span: 5 }}
                        style={{
                            color: '#fff',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: 25,
                            padding: 20,
                        }}
                    >
                        <h1 style={{ fontSize: 40, color: '#24cad5' }}>
                            Human Tumor Atlas Network
                        </h1>
                        <br />

                        <p style={{ fontSize: 20 }}>
                            HTAN is a National Cancer Institute (NCI)-funded
                            Cancer Moonshot<sup>SM</sup> initiative to construct
                            3-dimensional atlases of the dynamic cellular,
                            morphological, and molecular features of human
                            cancers as they evolve from precancerous lesions to
                            advanced disease. (
                            <span style={{ fontStyle: 'italic' }}>
                                <a
                                    style={{ color: '#fff' }}
                                    href="https://www.sciencedirect.com/science/article/pii/S0092867420303469"
                                >
                                    Cell April 2020
                                </a>
                            </span>
                            )
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                paddingTop: 10,
                                justifyContent: 'center',
                            }}
                        >
                            <ButtonToolbar>
                                <Button
                                    href="/explore"
                                    variant="primary"
                                    className="mr-4"
                                    size="lg"
                                >
                                    Explore latest Data
                                </Button>
                                <Button
                                    href="/overview"
                                    variant="primary"
                                    className="mr-4"
                                    size="lg"
                                >
                                    Learn more about HTAN
                                </Button>
                            </ButtonToolbar>
                        </div>
                    </Col>
                </Row>
            </Jumbotron>
            <Container
                fluid
                style={{
                    backgroundColor: '#eee',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                }}
            >
                <Row className="justify-content-md-center">
                    {synapseCounts &&
                        synapseCounts.map((report: EntityReport) =>
                            dashboardIcon(report.text, report.description)
                        )}
                </Row>
            </Container>
            {/* <Container
                fluid
                style={{
                    backgroundColor: '#ddd',
                    color: 'black',
                    padding: '5px',
                }}
            >
                <Row className="justify-content-md-center">
                    <span>About this Release:</span>
                </Row>
            </Container> */}
            <Container
                fluid
                style={{
                    paddingTop: '20px',
                    paddingBottom: '60px',
                }}
            >
                <Row className="justify-content-md-center">
                    <p style={{ fontSize: 'medium' }}>
                        The latest HTAN data release includes tumors originating
                        from{' '}
                        <strong>
                            {computeUniqueAttributeValueCount(organSummary)}
                        </strong>{' '}
                        primary tumor sites:
                    </p>
                </Row>
                <Row className="pr-5 pl-5">
                    <SummaryChart
                        data={organSummary}
                        dependentAxisEntityName="Case"
                        stackedByCenter={false}
                        scale={chartScale}
                        minDomain={minDomain}
                        dependentAxisTickFormat={dependentAxisTickFormat}
                    />
                </Row>
                <Row className="justify-content-md-center">
                    <p style={{ fontSize: 'medium' }}>
                        The tumors were profiled with{' '}
                        <strong>
                            {computeUniqueAttributeValueCount(assaySummary)}
                        </strong>{' '}
                        different types of assays:
                    </p>
                </Row>
                <Row className="pr-5 pl-5">
                    <SummaryChart
                        data={assaySummary}
                        dependentAxisEntityName="Case"
                        stackedByCenter={false}
                        scale={chartScale}
                        minDomain={minDomain}
                        dependentAxisTickFormat={dependentAxisTickFormat}
                    />
                </Row>
                <Row className="justify-content-md-center">
                    <p style={{ fontSize: 'medium' }}>
                        Many more profiled tumors will be available in the
                        future. Stay tuned!
                    </p>
                </Row>
            </Container>

            {/*<div className={styles.atlasCardContainer}>*/}
            {/*    {atlases.map((atlas) => {*/}
            {/*        let title = atlas.title.rendered.substr(0, 30);*/}
            {/*        if (title.length < atlas.title.rendered.length) {*/}
            {/*            title += '...';*/}
            {/*        }*/}

            {/*        return (*/}
            {/*            <div className={styles.atlasCard}>*/}
            {/*                <h4>*/}
            {/*                    <a href={getAtlasPageURL(atlas.htan_id)}>*/}
            {/*                        {title}*/}
            {/*                    </a>*/}
            {/*                </h4>*/}

            {/*                <div className={styles.imageHolder}>*/}
            {/*                    <img*/}
            {/*                        src={*/}
            {/*                            atlas.home_image.guid ||*/}
            {/*                            'https://humantumoratlas.org/wp-content/uploads/2020/04/example_1-1.jpg'*/}
            {/*                        }*/}
            {/*                    />*/}
            {/*                    <a*/}
            {/*                        className={'btn btn-primary'}*/}
            {/*                        href={getAtlasPageURL(atlas.htan_id)}*/}
            {/*                    >*/}
            {/*                        Explore*/}
            {/*                    </a>*/}
            {/*                </div>*/}

            {/*                <p className={styles.altasText}>*/}
            {/*                    {atlas.short_description ||*/}
            {/*                        "This is a short description of the Atlas. It shouldn't be more than a hundred words."}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        );*/}
            {/*    })}*/}
            {/*</div>*/}
        </>
    );
};

export default HomePage;
