import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './About.css';
import { Link } from "react-router-dom";

const About = () => {
  
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // Function to handle sorting based on giatri1
const handleSort = () => {
  const sortedDataCopy = [...sortedData];
  sortedDataCopy.sort((a, b) => (sortOrder === 'asc' ? a.giatri1.localeCompare(b.giatri1) : b.giatri1.localeCompare(a.giatri1)));
  setSortedData(sortedDataCopy);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Lấy dữ liệu từ localStorage khi trang được tải lần đầu
  useEffect(() => {
    const storedData = localStorage.getItem('myData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setSortedData([...parsedData]); // Initialize sortedData with the initial data
    }
  }, []);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Lấy dữ liệu từ MongoDB

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/GET_REACT");
        const modifiedData = response.data.map(item => {
          const qrValues = item.qr.split('/');
          return {
            qr: item.qr,
            giatri1: qrValues[0] || '',
            giatri2: qrValues[1] || '',
            giatri3: qrValues[2] || '',
            giatri4: qrValues[3] || '',
          };
        });

        const sortedDataCopy = [...modifiedData];
        sortedDataCopy.sort((a, b) => (sortOrder === 'asc' ? a.giatri1.localeCompare(b.giatri1) : b.giatri1.localeCompare(a.giatri1)));

        setData(modifiedData);
        setSortedData(sortedDataCopy);

        localStorage.setItem('myData', JSON.stringify(modifiedData));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, [sortOrder]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
      <div className='cont'>
      {/* TẠO OPTION ĐỂ SORT CÁC GIÁ TRỊ THEO CỘT */}
      <div>
              <label>SẮP XẾP THEO: </label>
              <select onChange={handleSort}>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
      </div>


      {/* BẢNG TABLE ĐỂ HIỂN THỊ DỮ LIỆU GET VỀ */}
        <table>
          <thead>
            <tr>
              <th>SAN PHAM</th>
              <th>GIA TIEN</th>
              <th>CHAT LUONG</th>
              <th>KHOI LUONG</th>

            </tr>
          </thead>
          <tbody>
            {sortedData.map((user, index) => (
              <tr key={index}>
                <td>{user.giatri1}</td>
                <td>{user.giatri2}</td>
                <td>{user.giatri3}</td>
                <td>{user.giatri4}</td>
              </tr>
            ))}
          </tbody>
      </table>

      <button className='button'>
        <Link to="/">Home</Link>
      </button>               

            
      </div>
    );
};
 
export default About;