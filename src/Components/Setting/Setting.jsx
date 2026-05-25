import React, { useState } from "react";
import "./Setting.css";

const Setting = () => {

  const [activeTab, setActiveTab] = useState("profile");
 const [showAddBankForm, setShowAddBankForm] = useState(false);
 const bankAccounts = [
  {
    id: 1,
    bankName: "HDFC Bank",
    accountNumber: "**** **** 1234",
    accountType: "Current",
    tag: "Primary",
  },
  {
    id: 2,
    bankName: "SBI",
    accountNumber: "**** **** 5678",
    accountType: "Savings",
    tag: "Secondary",
  },
];

  return (
    <div className="account-settings-container">

      
      <div className="settings-header">
        <h1>
          Account <span>Settings</span>
        </h1>

        <p>
          Manage your Ayurvedic shop's identity, digital presence, and
          operational preferences from a centralized command center.
        </p>
      </div>

      <div className="settings-body">

        {/* Sidebar */}
        <div className="settings-sidebar">

          <button
            className={activeTab === "profile" ? "active-tab" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={activeTab === "business" ? "active-tab" : ""}
            onClick={() => setActiveTab("business")}
          >
            Business details
          </button>

          <button
            className={activeTab === "bank" ? "active-tab" : ""}
            onClick={() => setActiveTab("bank")}
          >
            Bank info
          </button>

        </div>

        
        <div className="settings-content">

          
          {activeTab === "profile" && (
            <>
              <h2>Profile</h2>

              <p className="profile-desc">
                This information will be displayed publicly to your customers.
              </p>

              <div className="profile-card">
                <div className="profile-left">

                  <div className="profile-image-wrapper">
                    <button className="camera-btn">📷</button>
                  </div>

                  <div>
                    <h3>Nidhesh Sharma</h3>

                    <p>
                      This information will be displayed publicly to your
                      customers.
                    </p>
                  </div>

                </div>
              </div>

              <div className="profile-form-card">

                <div className="form-row">

                  <div className="form-group">
                    <label>Full Name</label>

                    <input
                      type="text"
                      value="Nidhesh Sharma"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>

                    <input
                      type="email"
                      value="vanya@apotechary.organic"
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label>Short Bio</label>

                  <textarea>
Traditional Ayurvedic practitioner with over 12 years of experience.
                  </textarea>
                </div>

              </div>
            </>
          )}

         
          {activeTab === "business" && (
            <>
              <div className="settings-content">
          <h2>Business details</h2>

          <p className="business-desc">
            Essential information for legal and operational compliance.
          </p>

         
          <div className="business-card">
        
            <div className="form-group">
              <label>Store Name</label>

              <input type="text" value="Apothecary" />
            </div>

           
            <div className="form-group">
              <label>Warehouse Address</label>

              <input
                type="text"
                value="Plot 42, Green Belt Industrial Area, Jaipur, Rajasthan - 302001"
              />
            </div>

          
            <div className="form-row">
              <div className="form-group">
                <label>Tax Identification (GST/VAT)</label>

                <input type="text" value="08AAAAA0000A1Z5" />
              </div>

              <div className="form-group">
                <label>Business Category</label>

                <input type="text" value="Ayurvedic Supplements" />
              </div>
            </div>

           
            <div className="form-group">
              <label>Store Image or logo</label>

              <div className="upload-box">
                <div className="upload-icon">↑</div>

                <h4>Click to Upload</h4>

                <p>or drag & drop PNG, JPG up to 5MB each</p>
              </div>
            </div>
          </div>

         
        </div>
            </>
          )}

        
{activeTab === "bank" && (
  <>

  

    <div className="bank-header-top">

      <div>
        <h2>Bank info</h2>

        <p className="business-desc">
          Where your earnings will be deposited every fortnight.
        </p>
      </div>

     <div className="bank-header-actions">

  {!showAddBankForm ? (

    <button
      className="add-card-btn"
      onClick={() => setShowAddBankForm(true)}
    >
      + Add New Card
    </button>

  ) : (

    <button
      className="close-bank-btn"
      onClick={() => setShowAddBankForm(false)}
    >
      ✕
    </button>

  )}

</div>

    </div>

   

    {showAddBankForm ? (

  <div className="bank-card-container">


    
    <div className="bank-form-top">

      <h3>Add Bank Account</h3>

     

    </div>

    <div className="form-row">

      <div className="form-group">
        <label>Account Holder Name</label>

        <input
          type="text"
          placeholder="Apothecary"
        />
      </div>

      <div className="form-group">
        <label>Bank Name</label>

        <select>
          <option>Apothecary</option>
          <option>HDFC Bank</option>
          <option>SBI</option>
        </select>
      </div>

    </div>

    <div className="form-group">
      <label>Account Number</label>

      <input
        type="text"
        placeholder="**** **** 6660"
      />
    </div>

    <div className="form-group">
      <label>Confirm Account Number</label>

      <input
        type="text"
        placeholder="**** **** 6660"
      />
    </div>

    <div className="form-group">
      <label>IFSC Code</label>

      <input
        type="text"
        placeholder="SBIN0001234"
      />
    </div>

  </div>

) : (

      <>

      <div className="bank-card-container">

  <div className="bank-top-header">

    <p className="linked-account-text">
      Linked Account
    </p>

    <button className="manage-card-btn">
      Manage Card →
    </button>

  </div>

  <div className="bank-cards-row">

    {bankAccounts.map((item) => (

      <div className="single-bank-card" key={item.id}>

        <div className="bank-card-top">

          <span className="bank-icon">
            🏦
          </span>

          <span
            className={
              item.tag === "Primary"
                ? "bank-tag"
                : "bank-tag secondary-tag"
            }
          >
            {item.tag}
          </span>

        </div>

        <h3>{item.bankName}</h3>

        <p className="account-number">
          {item.accountNumber}
        </p>

        <div className="bank-card-bottom">

          <span>{item.accountType}</span>

          <button>Edit</button>

        </div>

      </div>

    ))}

  </div>

  <div className="secure-processing-box">

    <h4>🛡 Secure Processing</h4>

    <p>
      All bank data is encrypted with bank-grade 256-bit SSL.
      Veda Merchant never stores your full account credentials.
    </p>

  </div>

</div>


      </>
    )}

    

  

  </>
)}

          <div className="button-row">

            <button className="discard-btn">
              Discard Changes
            </button>

            <button className="save-btn">
              Save Changes
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Setting;