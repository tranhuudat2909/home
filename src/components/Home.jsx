import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import './Left-form.css';
import './Right-form.css';
import { Link } from "react-router-dom";


function Home() {
  const [servo1, setservo1] = useState(0);
  const [servo2, setservo2] = useState(0);
  const [servo3, setservo3] = useState(0);
  const [servo4, setservo4] = useState(0);
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [mode, setMode] = useState(localStorage.getItem('mode') || '');
  const [control, setControl] = useState(localStorage.getItem('control') || '');


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CÁC THỨ LIÊN QUAN ĐẾN MANUAL VÀ AUTO ----- START VÀ STOP

// NÚT MANUAL
const setModeManual = () => {
  setMode('manual');
  localStorage.setItem('mode', 'manual');
};

// NÚT AUTO
const setModeAuto = () => {
  setMode('auto');
  localStorage.setItem('mode', 'auto');
};

// NÚT START 
const setStartSystem = () => {
  setControl('start');
  localStorage.setItem('control', 'start');
};

// NÚT STOP 
const setStopSystem = () => {
  setControl('stop');
  localStorage.setItem('control', 'stop');
};


// SEND DỮ LIỆU LÊN MONGO
useEffect(() => {
  const sendModeData = async () => {
    try {
      await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/auto',
        {
          mode: mode === 'auto' ? 'auto' : 'manual',
          control: control === 'start' ? 'start' : 'stop',
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Call the function initially and whenever 'mode' changes
  sendModeData();
}, [mode,control]);



// GET DỮ LIỆU VỀ TỪ MONGO
useEffect(() => {
  const fetchDataFromMongoDB = async () => {
    try {
      const response = await fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/get_auto');
      const data = await response.json();

      console.log('Dữ liệu từ MongoDB:', data);

      // // Xử lý logic dựa trên giá trị control
      if (data.length > 0 && data[0].control === 'start') {
        setStartSystem();
      } else {
        setStopSystem();
      }

      // // Xử lý logic dựa trên giá trị mode
      if (data.length > 0 && data[0].mode === 'manual') {
        setModeManual();
      } else {
        setModeAuto();
      }

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ MongoDB:', error);
    }
  };

  // Gọi fetchDataFromMongoDB mỗi khi component được render
  fetchDataFromMongoDB();

  // Thiết lập interval để cập nhật dữ liệu mỗi 5 giây (hoặc bất kỳ khoảng thời gian nào bạn muốn)
  const intervalId = setInterval(fetchDataFromMongoDB, 3000);

  // Clear interval khi component unmount để tránh memory leaks
  return () => clearInterval(intervalId);
}, []); // useEffect chỉ chạy một lần khi component được mount

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

 // HÀM SẮP XẾP GIÁ TRỊ DỰA TRÊN giatri1 HAY CỘT 1
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NÚT SUBMIT ĐỂ GỬI DỮ LIỆU LÊN MONGO
const submit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-zsywh/endpoint/react", {
      servo1,
      servo2,
      servo3,
      servo4,
    });

    // Hiển thị thông báo khi dữ liệu được gửi thành công
    window.alert('Dữ liệu đã được gửi thành công!');


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
    // Hiển thị thông báo khi có lỗi
    window.alert('Có lỗi khi gửi dữ liệu!');
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TRÌNH BÀY CODE DISPLAY RA WEB
  return (
    <div className='cont'>
      {/* CÁC THANH TRƯỢT ĐỂ POST DATA LÊN MONGODB */}
      <h1 className='tieude-chinh'> HỆ THỐNG ĐIỀU KHIỂN CÁNH TAY ROBOT</h1>
      <div className='form-container'>
        <div className='left-form'>
          <h1 className='tieude-bang'> BẢNG ĐIỀU KHIỂN TỰ ĐỘNG</h1>
          <p className='mode-label'>CHỌN CHẾ ĐỘ ĐIỀU KHIỂN: </p>
          <div className='toggle-buttons'>
            <button onClick={setModeManual} className={`manual-button ${mode === 'manual' ? 'active' : ''}`}>       
              Manual
            </button>
            <button onClick={setModeAuto} className={`auto-button ${mode === 'auto' ? 'active' : ''}`}>
              Auto
            </button>
          </div>

          <div className='start-stop'>
            <p className='mode-label'>NÚT ĐIỀU KHIỂN </p>
            <button onClick={setStartSystem} className={`start-button ${control === 'start' ? 'active' : ''}`}>
              START
            </button>
            <button onClick={setStopSystem} className={`stop-button ${control === 'stop' ? 'active' : ''}`}>
              STOP
            </button>
          </div>                   
        </div>  

        <div className='right-form'>
          <h1 className='tieude-bang'> BẢNG ĐIỀU KHIỂN BẰNG TAY</h1>
                        <label>
                            BASE 
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo1}
                                onChange={(e) => { setservo1(e.target.value) }}
                            />
                            {servo1}
                        </label> 
                        <label>
                            SHOULDER
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo2}
                                onChange={(e) => { setservo2(e.target.value) }}
                            />
                            {servo2}
                        </label>  
                        <label>
                            ELBOW
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo3}
                                onChange={(e) => { setservo3(e.target.value) }}
                            />
                            {servo3}
                        </label>  
                        <label>
                            GRIPPER
                            <input
                                type="range"
                                min="0"
                                max="180"
                                value={servo4}
                                onChange={(e) => { setservo4(e.target.value) }}
                            />
                            {servo4}
                        </label>                 
                  <input type="submit" onClick={submit} value="SEND DATA " />
        </div>
      </div>
      
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


      {/* NÚT ĐỂ CHUYỂN TRANG WEB */}
      <button className='button'>
        <Link to="/about">GO TO DATA</Link>
      </button>        

    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default Home;

    
