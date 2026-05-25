import { MapPin, Phone, Clock } from 'lucide-react'
import './OrderDetail.css'
import upiicon from'../../../Assests/upi.png'
import { useNavigate } from 'react-router-dom'

export default function OrderDetails() {
    const Navigate =useNavigate();

  return (
    <div className="order-container">
     
        <div className="order-header">
          <div className="order-header-content">
           <div className="order-header-left">
              <button className="order-back-btn" onClick={()=>Navigate('/notifications')}>
      <span>←</span> Back
    </button>
  <div className="order-top-row">

   
    <h1 className="order-title">#ORD200</h1>
    
  </div>

  <p className="order-date">Placed Oct 26, 2023 · 02:45 PM</p>
</div>
            <div className="order-header-right">
              <button className="order-btn-cancel">Cancel Order</button>
              <button className="order-btn-shipped">Mark as Shipped</button>
            </div>
          </div>
        </div>

     
        <div className="order-content-grid">
        
          <div className="order-left-column">
           
            <div className="order-card1">
              <div className="order-card-header">
                <h2 className="order-card-title">Order Items</h2>
              </div>
              <div className="order-card-content" style={{padding: 0}}>
                <div style={{overflowX: 'auto'}}>
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>SKU</th>
                        <th>QTY</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                      <tr>
                        <td>
                          <div className="order-product-cell">
                            <div className="order-product-icon yellow">🌿</div>
                            <div>
                              <p className="order-product-name">Brahmi Hair Oil</p>
                              <p className="order-product-desc">Hair Care · 100ml</p>
                            </div>
                          </div>
                        </td>
                        <td className="order-sku">BHI-OIL-100</td>
                        <td className="order-qty">2</td>
                        <td className="order-price">Rs. 1,250.00</td>
                      </tr>
                      {/* Item 2 */}
                      <tr>
                        <td>
                          <div className="order-product-cell">
                            <div className="order-product-icon amber">🧴</div>
                            <div>
                              <p className="order-product-name">Neem & Tulsi Cleanser</p>
                              <p className="order-product-desc">Skin Care · 200ml</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="order-sku">NT-CLN-200</td>
                        <td className="order-qty">1</td>
                        <td className="order-price">Rs. 890.00</td>
                      </tr>
                        <tr>
                        <td>
                          <div className="order-product-cell">
                            <div className="order-product-icon yellow">🌿</div>
                            <div>
                              <p className="order-product-name">Brahmi Hair Oil</p>
                              <p className="order-product-desc">Hair Care · 100ml</p>
                            </div>
                          </div>
                        </td>
                        <td className="order-sku">BHI-OIL-100</td>
                        <td className="order-qty">2</td>
                        <td className="order-price">Rs. 1,250.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

           
            <div className="order-pricing">
              <div className="order-pricing-row">
                <p className="order-pricing-label">Subtotal</p>
                <p className="order-pricing-value">Rs. 2,140.00</p>
              </div>
              <div className="order-pricing-row">
                <p className="order-pricing-label">Shipping</p>
                <p className="order-pricing-value free">FREE</p>
              </div>
              <div className="order-pricing-row">
                <p className="order-pricing-label">Discount (FESTIVE50)</p>
                <p className="order-pricing-value discount">-Rs. 214.00</p>
              </div>
              <div className="order-pricing-total">
                <p className="order-pricing-total-label">TOTAL</p>
                <p className="order-pricing-total-value">Rs. 1,926.00</p>
              </div>
            </div>

           
            <div className="order-card">
              <div className="order-card-header">
                <h2 className="order-card-title">Order Timeline</h2>
              </div>
              <div className="order-card-content">
                <div className="order-timeline">
                  
                  <div className="order-timeline-item">
                    <div>
                      <div className="order-timeline-dot completed">✓</div>
                      <div className="order-timeline-line"></div>
                    </div>
                    <div className="order-timeline-content">
                      <h4 className="order-timeline-title">Order Placed</h4>
                      <p className="order-timeline-time">Oct 26, 2023 · 02:45 PM</p>
                      <p className="order-timeline-desc">The order has been successfully placed by the customer.</p>
                    </div>
                  </div>

                 
                  <div className="order-timeline-item">
                    <div>
                      <div className="order-timeline-dot completed">✓</div>
                      <div className="order-timeline-line"></div>
                    </div>
                    <div className="order-timeline-content">
                      <h4 className="order-timeline-title">Payment Confirmed</h4>
                      <p className="order-timeline-time">Oct 26, 2023 · 03:30 PM</p>
                      <p className="order-timeline-desc">Payment via UPI was confirmed successfully.</p>
                    </div>
                  </div>

                 
                  <div className="order-timeline-item">
                    <div>
                      <div className="order-timeline-dot completed">✓</div>
                      <div className="order-timeline-line"></div>
                    </div>
                    <div className="order-timeline-content">
                      <h4 className="order-timeline-title">Processing</h4>
                      <p className="order-timeline-time">Oct 26, 2023 · 04:00 PM</p>
                      <p className="order-timeline-desc">Pending packing...</p>
                    </div>
                  </div>

                 
                  <div className="order-timeline-item">
                    <div>
                      <div className="order-timeline-dot pending">⏱</div>
                    </div>
                    <div className="order-timeline-content">
                      <h4 className="order-timeline-title">Shipped</h4>
                      <p className="order-timeline-time">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="order-right-column">
          
          
             <div className="order-card">
      <div className="order-customer-header">
        <div>
          <h2 className="order-card-title">Customer</h2>
        </div>
        <div>
          <button className="order-view-profile">View Profile</button>
        </div>
      </div>

      <div className="order-card-content">
        <div className="order-customer-info">
          <div className="order-avatar">PS</div>

          <div className="order-customer-details">
            <p className="order-customer-name">Priya Sharma</p>
            <p className="order-customer-email">priya.sh@email.com</p>
          </div>
        </div>

        <div className="order-customer-phone">
          <Phone className="order-customer-phone-icon" />
          <p style={{ margin: 0, fontSize: '14px', color: '#3F4945' ,verticalAlign:'middle',fontWeight:'500'}}>
            +91 98765 43210
          </p>
        </div>

        <div className="order-customer-stats">
          <div className="order-stat">
            <p className="order-stat-label">Orders</p>
            <p className="order-stat-value small">12</p>
          </div>
          <div className="order-stat1">
            <p className="order-stat-label">Spent</p>
            <p className="order-stat-value small">Rs. 18,450</p>
          </div>
        </div>
      </div>
    </div>

            <div className="order-card">
              <div className="order-customer-header">
               
                  <h2 className="order-card-title">Shipping</h2>
                 
                
                <div>
                     <button className="order-view-profile">Edit</button>
                </div>
              </div>
            
                <div className='order-card-address'>
  <p className="order-shipping-type">HOME DELIVERY</p>
                <p className="order-shipping-address">
                   42, Green Valley Apartments
Palm Grove Road, Indiranagar, Bengaluru, Karnataka, 560038
                </p>
               
                </div>
                
                <div>
      <p className="order-delivery-note">
                  "Leave at the security gate if no answer"
                </p>
</div>
                
                <div className="order-map-placeholder">
                  <MapPin className="order-map-icon" />
                  <p className="order-map-text">Map showing delivery location</p>
                </div>

              
              </div>
            

           
            <div className="order-card2">
             
                <div className="order-customer-header">
                  <h2 className="order-card-title">Payment</h2>
                  <span className="order-payment-badge">Paid</span>
                </div>
           
          <div className='item-header'>  
               <div className="order-payment-item">
  <p className="order-payment-label">Method</p>
  <p className="order-payment-value">
    <span className='order-payment-img'><img src ={upiicon}/></span> UPI
  </p>
</div>

<div className="order-payment-item">
  <p className="order-payment-label">Transaction ID</p>
  <p className="order-payment-value1">#09821-5283-8472</p>
</div>

<div className="order-payment-item">
  <p className="order-payment-label">Timestamp</p>
  <p className="order-payment-value">26 Oct, 02:50 PM</p>
</div>
</div>
            </div>

          </div>
        </div>
    
    </div>
  )
}
