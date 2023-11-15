import React, {useState, useEffect} from 'react';
import './Home.scss';
import StationList from './StationList.js'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Home() {
  const [stationList, setStationList] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  /*
  *Initially load the station list.
  * Here simple fetch method is used
  * We can implement redux and axios to keep the data more global
  * */
  useEffect(()=> {
     fetch('https://environment.data.gov.uk/flood-monitoring/id/stations')
      .then((response) => response.json())
      .then((responseJson) => {
        setStationList(responseJson.items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  return (
    <Container>
      <div className="main">
        <Row>
          <Col xs={12} md={6} lg={6} className="headerContainer">
            <h2> Flood Monitoring</h2>
          </Col>
          {/*
          *Simple search tool implemented here
          */}
          <Col xs={12} md={6} lg={6} className="searchContainer">
            <p>Search here</p>
            <input
              type="text"
              value={labelFilter}
              onChange={(e) =>
                setLabelFilter(e.target.value)
              }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {stationList && <StationList stationList={stationList} labelFilter={labelFilter}/>}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Home;