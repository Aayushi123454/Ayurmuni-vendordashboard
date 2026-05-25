import React from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";
import notification from "../../../Assests/notification (3).png"
import notificationicon from "../../../Assests/notification (2).png"
import meesageicon from "../../../Assests/messageicon.png"
import successful from "../../../Assests/successful.png"

const Notification= () => {
    const Navigate  = useNavigate();
  return (
    <div className="notification-page">
      
  

      <div className="notification-section">
        <div className="top-row">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your ayurmuni daily rhythm.</p>
          </div>

          <button className="mark-btn">✔ Mark all as read</button>
        </div>

        
        <div className="tabs">
          <button className="active">All</button>
          <button>Orders</button>
          <button>Inventory</button>
          <button>Customers</button>
          <button>System</button>
        </div>
        
    <div className="cardn green1">
  <div className="card-content">

  
    <div className="icon-box green-bg">
        <img src ={notification}/>
    </div>

    
    <div className="left">
      <h3>New Order Received</h3>
      <p>Order #VD-4821 has been placed for 3x Triphala Digestive Care.</p>

      <div className="btn-group">
        <button className="dark-btn" onClick={() => Navigate("/OrderDetail")}>
          View Order
        </button>
        <button className="light-btn">Dismiss</button>
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right">
    <span>2 mins ago</span>
    <div className="dot green-dot"></div>
  </div>
</div>

     <div className="cardn red1">
  <div className="card-content">

   
    <div className="icon-box red-bg">
    <img src ={notificationicon}/>
    </div>

    <div className="left">
      <h3>Low Stock Alert</h3>
      <p>Brahmi Hair Oil is below 10 units. Current stock: 4 items</p>

      <div className="btn-group">
        <button className="dark-btn" >
        Restock Now
        </button>
        <button className="light-btn">View Inventory</button>
      </div>
    </div>
  </div>
  <div className="right">
    <span>2 mins ago</span>
    <div className="dot red-dot"></div>
  </div>
</div>


        <div className="cardn ">
  <div className="card-content">

  
    <div className="icon-box grey-bg">
        <img src ={meesageicon}/>
    </div>

    
    <div className="left">
      <h3>New Order Received</h3>
      <p>Order #VD-4821 has been placed for 3x Triphala Digestive Care.</p>

      <div className="btn-group">
        <button className="grey-btn" >
          View Order
        </button>
      
      </div>
    </div>
  </div>


  <div className="right">
    <span>2 mins ago</span>
   
  </div>
</div>

  <div className="cardn ">
  <div className="card-content">

  
    <div className="icon-box grey-bg">
        <img src ={successful}/>
    </div>

    
    <div className="left">
      <h3>New Order Received</h3>
      <p>Order #VD-4821 has been placed for 3x Triphala Digestive Care.</p>

      
    </div>
  </div>


  <div className="right">
    <span>2 mins ago</span>
   
  </div>
</div>

     <div className="cardn green1">
  <div className="card-content">

  
    <div className="icon-box green-bg">
        <img src ={notification}/>
    </div>

    
    <div className="left">
      <h3>New Order Received</h3>
      <p>Order #VD-4821 has been placed for 3x Triphala Digestive Care.</p>

      <div className="btn-group">
        <button className="dark-btn" onClick={() => Navigate("/OrderDetail")}>
          View Order
        </button>
       
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right">
    <span>2 mins ago</span>
    <div className="dot green-dot"></div>
  </div>
</div>   

        <div className="load-more">
          <button>Load older notifications</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
