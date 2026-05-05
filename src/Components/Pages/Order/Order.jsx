import React from "react";
import "./Order.css";
import Critical from "../../../Assests/Critical.png"
import Alerticon from "../../../Assests/Alert1.png"
import Alerticon1 from "../../../Assests/Alert2.png"
import arrowtrend from "../../../Assests/arrowtrend.png"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const Order = () => {
  const [dateRange, setDateRange] = useState([null, null]);
const [startDate, endDate] = dateRange;
  const ordersData = [
  {
    id: "#AV-1096",
    customer: "Meera Nair",
    product: "Ashwagandha Gold",
    price: 299,
    status: "new"
  },
  {
    id: "#AV-1093",
    customer: "Elena Vance",
    product: "Brahmi Oil",
    price: 449,
    status: "packing"
  },
  {
    id: "#AV-1092",
    customer: "Aarav Sharma",
    product: "Triphala Tonic",
    price: 243,
    status: "shipped"
  },
  {
    id: "#AV-1095",
    customer: "Sofia Chen",
    product: "Turmeric Curcumin",
    price: 125,
    status: "ready"
  }
];
  return (
    <div className="notification-page">
      
     
      <div className="orders-header">
        <h1>
          Orders <span>Ledger</span>
        </h1>
        <p>
          Manage your digital apothecary's orders, fulfillments, and delivery
          schedules from one central botanical command.
        </p>
      </div>

      
     <div className="orders-containers">
  <div className="order-card">
    <p className="order-title">Total Orders</p>
    <h2>1,284 <span>Units</span></h2>
     <div className="metric-change trend-up">
                  <span className="trend-arrow"><img src={arrowtrend}/></span>
                 <span className='trend-arrow-text-green'>+12%</span>
               </div>
   
  </div>

  <div className="order-card">
    <p className="order-title">New Orders</p>
    <h2>12</h2>
    <p className="order-change warning">Action Required</p>
  </div>

  <div className="order-card">
    <p className="order-title">Pending Fulfillments</p>
    <h2>42</h2>
    <p className="order-change danger">Urgent</p>
  </div>

  <div className="order-card">
    <p className="order-title">Avg. Order Value</p>
    <h2>Rs. 250</h2>
    <p className="order-change positive">↗ +12%</p>
  </div>
</div>

<div className="alerts-section">
  
  <h3 className="alerts-title"><img className="alert-header-icon"src={Critical}/>Critical Fulfillment Alerts</h3>

  <div className="alerts-container">
  
    <div className="alert-card">
      <div className="alert-icon red"><img src={Alerticon}/></div>
      <div className="alert-content">
        <h4>Order #8921 - Backordered</h4>
        <p>Ashwagandha Root Powder low in stock.</p>
      </div>
      <button className="alert-btn red">Restock</button>
    </div>

    {/* Card 2 */}
    <div className="alert-card">
      <div className="alert-icon green"><img src ={Alerticon1}/></div>
      <div className="alert-content">
        <h4>12 Shipments Delayed</h4>
        <p>Weather delay in Northern Distribution Center.</p>
      </div>
      <button className="alert-btn green">Notify Customer</button>
    </div>
  </div>
</div>

<div>
   <h2 className="manage-title">Manage Orders</h2>
</div>
<div className="manage-orders">
  <div className="main-toolbar">


 <div className="orders-toolbar">
 
    <div className="date-picker-wrapper">
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        placeholderText="Select Date Range"
        className="toolbar-btn"
      />
    </div>
    <select className="toolbar-btn"> <option> All status</option></select>
      <select className="toolbar-btn"> <option> All Payment</option></select>

 </div>
 < div className="orders-filter">
<button className="toolbar-btn"> Filter</button>
<button className="toolbar-btn">Export</button>
</div>
 </div>
 
  


 <div className="orders-info">
    <span className="order-info-img"></span>  <h1>You have<span className="order-info-border"> 1 new orders</span> received in the last hour.</h1>
  
  </div>
 
 <div className="orders-table">

  <table className="sales-table">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Product</th>
        <th>Value</th>
        <th>Current Status</th>
        <th>Fulfillment Actions</th>
      </tr>
    </thead>

    <tbody>
      {ordersData.map((order, index) => (
        <tr
          key={index}
          className={order.status === "new" ? "active-row" : ""}
        >
          
        
          <td>
            <div className="order-id">
              <h4>{order.id}</h4>
              <p>Today, 10:42 AM</p>
            </div>
          </td>

       
          <td>
            <div className="customer-info">
              <h4>{order.customer}</h4>
              <p>customer@email.com</p>
            </div>
          </td>

        
          <td>
            <div className="product">
              <img src={Critical} alt="" />
              <h4>{order.product}</h4>
            </div>
          </td>

      
          <td>
            <div className="order-price">
              Rs. {order.price}
            </div>
          </td>

          {/* STATUS */}
          <td>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </td>

          {/* ACTIONS */}
          <td>
            <div className="actions">
              {order.status === "new" && (
                <>
                  <button className="reject">Reject</button>
                  <button className="accept">Accept</button>
                </>
              )}

              {order.status === "packing" && (
                <button className="packed">
                  Mark as Packed
                </button>
              )}

              {order.status === "shipped" && (
                <button className="track">
                  Track Delivery
                </button>
              )}

              {order.status === "ready" && (
                <button className="handover">
                  Handover to Courier
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
 
  <div className="orders-footer">
    Showing {ordersData.length} of 1,284 orders
  </div>
 
</div>



 

 
 

    </div>
  );
};

export default Order;