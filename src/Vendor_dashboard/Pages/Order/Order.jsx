import React from "react";
import "./Order.css";
import Critical from "../../../Assests/Critical.png"
import Alerticon from "../../../Assests/Alert1.png"
import Alerticon1 from "../../../Assests/Alert2.png"
import arrowtrend from "../../../Assests/arrowtrend.png"
import image4 from "../../../Assests/image 4.png"
import image5 from "../../../Assests/Image5.png"
import DatePicker from "react-datepicker";
import ActionButton from "../../../Assests/Actionbutton.png"
import bookmark from "../../../Assests/bookmark.svg"
import buttonleft from "../../../Assests/buttonleft.png"
import buttonright from "../../../Assests/buttonright.png"
import filter from "../../../Assests/filter.png"
import Icon from "../../../Assests/Icon.png"
import { IoInformationCircleOutline } from "react-icons/io5";
import { TbReceipt } from "react-icons/tb";

import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";

const Order = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [warehouseData, setWarehouseData] = useState({
    processing: 82,
    backordered: 14,
  });
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
          <div className="metric-change trend-up1">
            <span className="trend-arrow"><img src={arrowtrend}/></span>
            <span className='trend-arrow text-green-600'>+12%</span>
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
          <p className="order-change positive"><span><img src={arrowtrend}/></span>+12%</p>
        </div>
      </div>

      <div className="alerts-section">

        <h3 className="alerts-title"><img className="alert-header-icon" src={Critical} />Critical Fulfillment Alerts</h3>

        <div className="alerts-container">

          <div className="alert-card">
            <div className="alert-icon red"><img src={Alerticon} /></div>
            <div className="alert-content">
              <h4>Order #8921 - Backordered</h4>
              <p>Ashwagandha Root Powder low in stock.</p>
            </div>
            <button className="alert-btn red">Restock</button>
          </div>

          {/* Card 2 */}
          <div className="alert-card">
            <div className="alert-icon green"><img src={Alerticon1} /></div>
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
          <div className="orders-filter">
            <button className="filter-btn">
              <img src={filter} alt="filter" />
              Filter
            </button>

            <button className="filter-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
          </div>
        </div>




        <div className="orders-info">
          <span className="order-info-img"><IoInformationCircleOutline /></span>  <h1 className="text-green-900">You have<span className="order-info-border"> 1 new orders</span> received in the last hour.Immediate acceptance recommended for some-day dispatch.</h1>

        </div>

        <div className="orders-table">

          <table className="sales-table">
            <thead className="order-table-header">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Value</th>
                <th>Current Status</th>
                <th className="fullfillment">Fulfillment Actions</th>
              </tr>
            </thead>

            <tbody>
              {ordersData.map((order, index) => (
                <tr
                  key={index}
                  className={`table-row ${order.status === "new" ? "active-row" : ""}`}
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
                      <img src={image5} alt="" />
                      <h4>{order.product}</h4>
                    </div>
                  </td>


                  <td>
                    <div className="order-price">
                      Rs. {order.price}
                    </div>
                  </td>


                  <td >
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>


                  <td>
                    <div className="actions">
                      {order.status === "new" && (
                        <>
                          <button className="reject" style={{ fontWeight: "600", fontSize: "14px" }}>Reject</button>
                          <button className="accept" style={{ fontWeight: "600", fontSize: "14px" }}>Accept</button>
                        </>
                      )}

                      {order.status === "packing" && (
                        <>
                          <button className="packed">
                            Mark as Packed
                          </button >

                          <button className="icon-btn">
                            <TbReceipt size={22}/>
                          </button>
                        </>


                      )}

                      {order.status === "shipped" && (
                        <>
                          <button className="track">
                            Track Delivery
                          </button>

                          <button className="icon-btn">
                            <TbReceipt size={22}/>
                          </button>
                        </>

                      )}

                      {order.status === "ready" && (<>
                        <button className="handover">
                          Handover to Courier
                        </button>
                        <button className="icon-btn">
                          <TbReceipt size={22} />
                        </button>

                      </>

                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="orders-footer">
          <div>Showing<span> {ordersData.length}</span> of <span>1,284 </span> orders</div>
          <div className="orders-footer-button">
            <button>
              <img src={buttonleft} alt="buttonleft" />
            </button>
            <button>
              <img src={buttonright} alt="buttonright" />
            </button>
          </div>
        </div>

      </div>

      <div className="post-table-section">

        {/* LEFT CARD */}
        <div className="warehouse-card">
          <div className="warehouse-header">
            <h3>Warehouse Cycle</h3>
            <span>Refresh: 5m</span>
          </div>

          <div className="progress-group">
            <div className="progress-label">
              <span>Processing Speed</span>
              <span className="blue">82%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill blue-fill" style={{ width: "82%" }}></div>
            </div>
          </div>

          <div className="progress-group">
            <div className="progress-label">
              <span className="red-text">Backordered Items</span>
              <span className="red-text">14%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill red-fill" style={{ width: "14%" }}></div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="spotlight-card">

          <h3>Seller Spotlight</h3>
          {/* <img  src={Icon} className="star-bg"/> */}
          <p className="text-white">
            "Your top selling item 'Ashwagandha Elixir' has
            reached 500 sales this week. Consider featuring
            it on your homepage." Your top selling item
            'Ashwagandha Elixir' has reached 500 sales this
            week. Consider featuring it on your homepage."
          </p>
        </div>

      </div>


    </div>
  );
};

export default Order;