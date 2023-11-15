import React, {useState, useEffect} from 'react';
import moment  from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable from 'react-data-table-component';
import './Home.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
/**
 * 
 * Based on the selected station , station reference is passing to this component
 * using the station reference fetch the staion reading for last 24 hrs.
 * 
 */

function StationReading (props) {
    var [stationReading, setStationsReading] = useState([]);
    var [stationReference] = useState(props.stationReference);

    useEffect(()=> {
      fetch(`https://environment.data.gov.uk/flood-monitoring/id/stations/${stationReference}/readings?_sorted&since=`+ moment.utc().subtract(1,"day").format())
       .then((response) => response.json())
       .then((responseJson) => {
        setStationsReading(responseJson.items);
       })
       .catch((error) => {
         console.error(error);
       });
     }, [stationReference]);
/**
 * 
 * the line chart is implemented here, which shows the 24 hrs data for the selelcted station
 * rechart is used for implementing the chart
 */

     const getChart = () => {
        var dataSet = [];
           if(stationReading && stationReading.length > 0) {
            dataSet = stationReading.map(function(val){
                return({name : moment(val.dateTime).format("'Do, h:mm'"), Reading : val.value})
              })
          } else {
            return (
                <div>No data to display</div>
            )
          }
          return (
            <ResponsiveContainer width="99%" height="99%">
            <LineChart data={dataSet} margin={{ top: 5, right: 5, left: 10, bottom: 5, }} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Reading" stroke="#8884d8" activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          );
    
      }
    /**
 * 
 * the table is implemented here, which shows the 24 hrs data for the selelcted station
 * react-data-table-component is used for implementing the table
 * which allow us simple pagination 
 */
      const getTableReading = () => {
        var data = [];
        var columns = [];
        if (stationReading && stationReading.length > 0) {
            columns = [
                {
                    name: 'Date',
                    selector: row => row.date,
                },
                {
                    name: 'Value',
                    selector: row => row.value,
                }
            ];
            data = stationReading.map(function(val, index){
                return({id : index+1, date : moment(val.dateTime).format("MMM Do, HH:mm"), value : val.value})
            })
        }
        const paginationComponentOptions = {
            noRowsPerPage: true
        };
        
            return (
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                />
            );
      }

      return (
        <div className='modalBodyContainer'>
            <Row>
                <Col xs={12} md={9} lg={9}>{getChart()}</Col>
                <Col xs={12} md={3} lg={3}>{getTableReading()}</Col>
            </Row>
        </div>
      );
}

export default StationReading;