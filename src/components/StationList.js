import React, {useState} from 'react';
import Table from 'react-bootstrap/Table';
import StationReading from './StationReading.js'
import Modal from 'react-bootstrap/Modal';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * this component is used implement station listing table with other informations
 * 
 * station list fetched from the API and passed to this component from the parent component.
 * 
 */
function StationList (props) {
  var [stationList] = useState(props.stationList);
  var [stationDetail, setStationDetail] = useState([]);
  var [loadStationReadingChart, setLoadStationReadingChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 200;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const loadStationReading = (data) => {
    setStationDetail (data);
    setLoadStationReadingChart(!loadStationReadingChart);
  }
  /**
   * 
   * bootstrap table is used here , so it's responsive.
   * table implemented by two functions , one for header and other for the content
   */
  const getTableHeader = () => {
    return (<thead>
      <tr>
        <th>#</th>
        <th>Station Name</th>
        <th>Catchment Name</th>
        <th>River Name</th>
        <th>Town</th>
        <th>Station Reference</th>
      </tr>
    </thead>)
  };

/**
 * Here table content implemented
 * table search and pagination changes are implemented
 * search parameter is passing from the parent component 
 */

  const getTableContent = () => {
    const labelFilter = props.labelFilter;
    if(stationList && stationList.length > 0) {
      var currentSet = stationList.slice ((currentPage-1)*itemsPerPage, (currentPage-1)*itemsPerPage + itemsPerPage);
      if(labelFilter !=='') {
        currentSet = currentSet.filter(val =>
          (val.label && val.label.toLowerCase().includes(labelFilter.toLowerCase())) ||
          (val.catchmentName && val.catchmentName.toLowerCase().includes(labelFilter.toLowerCase())) ||
          (val.riverName && val.riverName.toLowerCase().includes(labelFilter.toLowerCase())) ||
          (val.town && val.town.toLowerCase().includes(labelFilter.toLowerCase())) ||
          (val.town && val.stationReference.toLowerCase().includes(labelFilter.toLowerCase()))
        );
      }
      var tableContent = currentSet.map(function(val, index){
        return(<tr key={Math.random()} onClick={() => {loadStationReading(val)}} className='selectionIncluded'>
          <td>{(currentPage-1)*itemsPerPage+index+1}</td>
          <td>{val.label}</td>
          <td>{val.catchmentName}</td>
          <td>{val.riverName}</td>
          <td>{val.town}</td>
          <td>{val.stationReference}</td>
          </tr>);
          }
        )
        return tableContent;
    }
  };
/**
 * 
 * Modal is implemented, modal is implemented using bootstrap library. 
 * each station reading is implemented in this modal and that is on another component
 */
  const getStationReadingModal = () => {
    return (
      <Modal show={loadStationReadingChart} onHide={()=> {setLoadStationReadingChart(!loadStationReadingChart);}}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>{stationDetail.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<StationReading stationReference={stationDetail.stationReference}/>}
        </Modal.Body>
      </Modal.Dialog>
      </Modal>
    );
  }

  return (
    <Row>
      <Table striped bordered hover key={Math.random()}>
        {getTableHeader()}
        <tbody>
          {getTableContent()}
        </tbody>
      </Table>
      <Col xs={12} md={12} lg={12}>
        <Pagination size="sm">
          {[...Array(Math.ceil(stationList.length / itemsPerPage)).keys()].map((number) => (
            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Col>
      {loadStationReadingChart && getStationReadingModal()}
    </Row>
  );
}
export default StationList;