import React, { useEffect, useState } from 'react'
import "./Dashboard.css";
import icon1 from "../../../Assests/dashboard1.png"
import icon2 from "../../../Assests/dashboard2.png"
import icon3 from "../../../Assests/dashboard3.png"
import icon4 from "../../../Assests/dashboard4.png"
import icon5 from "../../../Assests/dashboard5.png"
import arrow from "../../../Assests/arrow.png"
import arrowtrend from "../../../Assests/arrowtrend.png"
import arrowtrendred from "../../../Assests/arrowtrendred.png"
import Revenue from "./Revenue";
import facecream from "../../../Assests/face cream.jpg"
import image from "../../../Assests/image 4.png"
import productimage from "../../../Assests/productImg/product1.png"
import NewlyArrivedStock from './Newarrivalstock';
import searchIcon from "../../../Assests/search.png";
import Crtical from "../../../Assests/Critical.png";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState("");



  const categories = [
    { name: "Chikitsa Yoga", value: 45, color: "#ff6b00" },
    { name: "Essential Oils", value: 28, color: "#3b82f6" },
    { name: "Medicinal Herbs", value: 18, color: "#facc15" },
    { name: "Supplements", value: 78, color: "#31c813" },

  ];

  const salesData = [
    {
      name: "Aloevera Gel",
      id: "#ORD900",
      price: 350,
      discount: 10,
      status: "completed",
      stock: 25,
      image: image

    },
    {
      name: "Cough Syrup",
      id: "#ORD901",
      price: 450,
      discount: 5,
      status: "InProgress",
      stock: 18,
      image: image
    },
    {
      name: "Amla Powder",
      id: "#ORD902",
      price: 280,
      discount: 15,
      status: "cancelled",
      stock: 12,
      image: image
    },
    {
      name: "Face Cream",
      id: "#ORD903",
      price: 520,
      discount: 8,
      status: "pending",
      stock: 30,
      image: image
    },
    {
      name: "Neem Extract",
      id: "#ORD904",
      price: 180,
      discount: 12,
      status: "InProgress",
      stock: 20,
      image: image
    },
    {
      name: "Tulsi Drops",
      id: "#ORD905",
      price: 220,
      discount: 6,
      status: "pending",
      stock: 14,
      image: image
    },
    {
      name: "Ashwagandha Powder",
      id: "#ORD906",
      price: 310,
      discount: 9,
      status: "completed",
      stock: 22,
      image: image
    },
    {
      name: "Triphala Tablet",
      id: "#ORD907",
      price: 390,
      discount: 11,
      status: "InProgress",
      stock: 16,
      image: image
    },
    {
      name: "Brahmi Tablet",
      id: "#ORD908",
      price: 260,
      discount: 7,
      status: "cancelled",
      stock: 10,
      image: image
    },
    {
      name: "Chyawanprash",
      id: "#ORD909",
      price: 480,
      discount: 5,
      status: "completed",
      stock: 28,
      image: image
    }
  ];

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const product = {
    name: "Face Cream",
    demand: 100,
    stock: 25,

  };

  const capacity = {
    safe: 70,
    warning: 50,
    risk: 30,
  };

  const Arc = ({ radius, percent, color }) => {
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (percent / 100) * circumference;

    return (
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    );
  };
  const safe = capacity.safe || 0;
  const warning = capacity.warning || 0;
  const risk = capacity.risk || 0;

  const total = safe + warning + risk || 1;

  const safePercent = (safe / total) * 100;
  const warningPercent = (warning / total) * 100;

  return (

    <div className='notification-page'>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon1} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>

          <div className="metric-label">Total Orders</div>
          <div className="metric-value">231</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon2} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Total Earnings</div>
          <div className="metric-value">Rs. 23,5684</div>
          <div className="metric-change trend-down">
            <span className="trend-arrow"><img src={arrowtrendred} /></span>
            <span className='trend-arrow-text'>Since Last month</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon3} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Seller Ratings</div>
          <div className="metric-value">460</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon4} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Pending orders</div>
          <div className="metric-value">7350</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrend} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-header">
            <div className="card-icon"><img src={icon5} /></div>
            <button className="arrow-button"><img src={arrow} /></button>
          </div>
          <div className="metric-label">Total Items</div>
          <div className="metric-value">152 Items</div>
          <div className="metric-change trend-up">
            <span className="trend-arrow"><img src={arrowtrendred} /></span>
            <span className='trend-arrow-text'>Since Last Week</span>
          </div>
        </div>
      </div>


      <div className="main-grid">

        <div className="left-column">
          <div className="revenue-section">
            <Revenue />
          </div>
          <div className="table-section">
            <div className="sales-header">

              <h2 className="header2">Sales & Order</h2>

              <div className="header-right">


                <div className="sales-search-box">
                  <img src={searchIcon} alt="search" className="sales-search-icon" />
                  <input
                    type="text"
                    placeholder="Search products, orders..."
                  />
                </div>

                <select className="rc-period second">
                  <option>Monthly</option>
                </select>

              </div>

            </div>


            <table className="sales-table">
              <thead>
                <tr>
                  <th>Product's Details</th>
                  <th>Order I'D</th>
                  <th>Price</th>
                  <th className="statuscenter">Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="10"><div className="sale-product-cell skeleton-row"></div></td>
                    </tr>
                  ))
                ) : Error ? (
                  <tr>
                    <td colSpan="5" style={{ color: "red", textAlign: "center" }}>
                      {Error}
                    </td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map((item, index) => (
                    <tr key={index}>
                      <td className="sale-product-cell">
                        <div className="sale-product-img">
                          <img src={item.image} alt="product" />
                        </div>

                        <div className="sale-product-info">
                          <p className="sale-product-name">{item.name}</p>
                          <span className="sale-stock-text">{item.stock} in stock</span>
                        </div>
                      </td>
                      <td>{item.id}</td>
                      <td>RS. {item.price}</td>
                      <td>
                        <span className={`status ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">view</button>
                      </td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        <div className="right-column">

          <div className="categories-card">
            <h3>Top Categories</h3>

            <div className="category-list">
              {categories.map((item, index) => (
                <div key={index} className="category-item-wrapper">

                  <div className="category-item">
                    <span className="category-name">{item.name}</span>
                    <span className="category-percentage">
                      {item.value}%
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(item.value, 100)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>

                </div>
              ))}
            </div>
          </div>


          <div className="best-selling-card">


            <div className="card-header">
              <h3>Best selling Products</h3>
              <div className="arrows">
                <button>{<ArrowLeft size={16} />}</button>
                <button>{<ArrowRight size={16} />}</button>
              </div>
            </div>

            <div className='cardbest'>

              <div className="product-box">
                <img src={productimage} alt="product" />
              </div>

              <div className="product-info">
                <div>
                  <h4>{product.name}</h4>
                  <p>
                    Demand<span> {product.demand}  +</span>  | In Stock <span>{product.stock}</span>
                  </p>
                </div>
                <div>
                  <button className="restock-btn">Re-stock</button>
                </div>

              </div>

            </div>




            <div className="capacity ">
              <h4>Capacity Guide</h4>

              <div className="capacity-content">
                <div className="semi-chart">
                  <svg width="140" height="140">
                    <g transform="rotate(-90 70 70)">
                      <Arc radius={48} percent={safe} color="#10B981" />
                      <Arc radius={42} percent={warning} color="#FFC107" />
                      <Arc radius={36} percent={risk} color="#F43F5E" />
                    </g>
                  </svg>

                  <div className="center-text">
                    <h3>{safe}%</h3>
                    <p>Safe</p>
                  </div>
                </div>

                <div className="legend">
                  <p><span className="dot green"></span>{safe}% <span className="innerspan"> Safe</span></p>
                  <p><span className="dot yellow"></span>{warning}% <span className="innerspan">Products In Warning Zone</span></p>
                  <p><span className="dot red"></span>{risk}% <span className="innerspan">Product share In Risk Zone</span></p>
                </div>
              </div>
            </div>

            {/* Dead Stock */}
            <div className="dead-stock">
              <p>Dead Stocks</p>
              <h2>25 Items</h2>
              <p className="down"> <span><img src={arrowtrendred} /></span>Since last month</p>
            </div>



          </div>

          <div className='revenue-section1'>
            <NewlyArrivedStock />
          </div>
        </div>
      </div>




    </div>

  )
}

export default Dashboard