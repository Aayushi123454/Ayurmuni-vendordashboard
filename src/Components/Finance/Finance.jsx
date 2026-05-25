import React from 'react'
import "./Finance.css";
import{useState,useEffect} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import Greenarrow from "../../Assests/Greenarrow.png"
import loader from "../../Assests/loadericon.png"
import Timer from "../../Assests/Timericon.png"
import Bankicon from "../../Assests/Bankicon.png"
import filter from "../../Assests/filter.png"
import searchIcon from "../../Assests/search.png"; 

const Finance = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const transactions = [
  {
    id: "#PAY-98214-AYU",
    date: "Oct 24, 2023",
    bank: "Chase **** 4421",
    status: "Completed",
    amount: "Rs. 1,850.20",
  },
  {
    id: "#PAY-97552-AYU",
    date: "Oct 10, 2023",
    bank: "Chase **** 4421",
    status: "Pending",
    amount: "Rs. 2,410.00",
  },
  {
    id: "#PAY-96101-AYU",
    date: "Sep 28, 2023",
    bank: "Chase **** 4421",
    status: "Failed",
    amount: "Rs. 920.40",
  },
  {
    id: "#PAY-95880-AYU",
    date: "Sep 15, 2023",
    bank: "Chase **** 4421",
    status: "Completed",
    amount: "Rs. 1,330.00",
  },
];

  return (
    <>
    <div className="notification-page">

        <div className="financials">
          <div className='finance-head'>
            <div >
   <h2 className='finance-heading'>Financials</h2>
  <p className="finanace-subtitle">Welcome back to your digital apothecary ledger.</p>
</div>
 
<div className="date-picker-wrapper1">
 

  <DatePicker
    selectsRange={true}
    startDate={startDate}
    endDate={endDate}
    onChange={(update) => {
      setDateRange(update);
    }}
    placeholderText="Select Date Range"
    className="toolbar-btn1"
  />
</div>
</div>

  <div className="cards">
  <div className="card">
    <p className="card-title">Total Earnings</p>

    <h2>
      <span>Rs.</span>
      122,480.50
    </h2>

    <div className="growth"><img src={Greenarrow} className='financeimage'/><span> +12.5% </span> from last month</div>
  </div>

  <div className="card">
    <p className="card-title">Next Payout</p>

    <h2>
      <span>Rs.</span>
      12,105.00
    </h2>

    <div className="date-badge">Nov 15, 2023</div>
  </div>

  <div className="card">
    <p className="card-title">Commissions Paid</p>

    <h2>
      <span>Rs.</span>
      842.12
    </h2>

    <small className="fee-text">6.5% average platform fee</small>
  </div>

  <div className="card highlight">
    <p className="card-title-dark">Available Balance</p>

    <h2 className="white">
      <span className='white'>Rs.</span>
      14,520.80
    </h2>

    <button>Request Payout</button>
  </div>
</div>

  
  <div className="middle">


  <div className="schedule">

    <h3>Settlement Schedule</h3>

    <div className="schedule-card">

      <div className="schedule-left">

        <div className="icon green-icon">
         <img src={loader} className='loader'/>
        </div>

        <div>
          <h4>Current Cycle Settlement</h4>
          <p>Estimated arrival: Nov 12 - Nov 14</p>
        </div>

      </div>

      <div className="schedule-right">
        <h5>Rs. 1,240.00</h5>
        <span className="processing">Processing</span>
      </div>

    </div>

    <div className="schedule-card">

      <div className="schedule-left">

        <div className="icon gray-icon">
          <img src = {Timer} className='loader'/>
        </div>

        <div>
          <h4>Future Settlement</h4>
          <p>Scheduled for: Nov 30</p>
        </div>

      </div>

      <div className="schedule-right">
        <h5>Rs. 865.00</h5>
        <span className="scheduled">Scheduled</span>
      </div>

    </div>

    <div className="schedule-card">

      <div className="schedule-left">

        <div className="icon green-icon">
          <img  src ={loader} className='loader'/>
        </div>

        <div>
          <h4>Current Cycle Settlement</h4>
          <p>Estimated arrival: Nov 12 - Nov 14</p>
        </div>

      </div>

      <div className="schedule-right">
        <h5>Rs. 1,240.00</h5>
        <span className="processing">Processing</span>
      </div>

    </div>

    <div className="schedule-card">

      <div className="schedule-left">

        <div className="icon gray-icon">
          <img src={Timer} className='loader'/>
        </div>

        <div>
          <h4>Future Settlement</h4>
          <p>Scheduled for: Nov 30</p>
        </div>

      </div>

      <div className="schedule-right">
        <h5>Rs. 865.00</h5>
        <span className="scheduled">Scheduled</span>
      </div>

    </div>

  </div>


  <div className="report">

  <h3>Commission Report</h3>

  <div className="report-card">

    <h4>October Breakdown</h4>

    <div className="report-item">
      <p>Gross Sales</p>
      <span>Rs. 5,240.00</span>
    </div>

    <div className="report-item report-red">
      <p>Referral Fees</p>
      <span>Rs. 262.00</span>
    </div>

    <div className="report-item report-red">
      <p>Botanical Logistics</p>
      <span>Rs. 145.50</span>
    </div>

    <div className="report-item report-red">
      <p>VAT / Taxes</p>
      <span>Rs. 48.20</span>
    </div>

    <div className="report-item total">
      <p>Net Earnings</p>
      <span>Rs. 4,784.30</span>
    </div>

    <button className="download-btn">
      Download CSV Report
    </button>

  </div>

</div>

</div>

 
 
  <div className="table-section1">

  <div className="table-top">
    <h4>Recent Payouts & Transactions</h4>

    <div className="table-actions">
      <input
        type="text"
        placeholder="Search payment id..."
        className="search-box1"
      />

      <div className="orders-filter">
    <button className="filter-btn">
      <img src={filter} alt="filter" />
      Filter
    </button>
  
    
  </div>
    </div>
  </div>

  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Payout ID</th>
          <th>Date</th>
          <th>Bank Account</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.date}</td>
           <td>
  <div className="bankhead">
    <img src={Bankicon} className="bankicon" />
    <span>{item.bank}</span>
  </div>
</td>

          <td>
  <span
    className={`status ${
      item.status === "Completed"
        ? "completed"
        : item.status === "Pending"
        ? "pending"
        : "failed"
    }`}
  >
    {item.status}
  </span>
</td>

            <td className="amount">{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="table-footer">
    <p>
      Showing <b>4</b> of <b>24</b> transactions
    </p>

    <div className="pagination">
      <button className="page-btn">‹</button>
      <button className="page-btn active">1</button>
      <button className="page-btn">2</button>
      <button className="page-btn">3</button>
      <button className="page-btn">›</button>
    </div>
  </div>

</div>

</div>
    </div>
    </>
  )
}

export default Finance