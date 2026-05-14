import React, { useState } from "react";
import "./Setting.css";

const Setting = () => {

  const [activeTab, setActiveTab] = useState("profile");
  const [showBankForm, setShowBankForm] = useState(false);

  return (
    <div className="account-settings-container">

      {/* Heading */}
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

        {/* Content */}
        <div className="settings-content">

          {/* PROFILE TAB */}
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

          {/* BUSINESS TAB */}
          {activeTab === "business" && (
            <>
              <div className="settings-content">
          <h2>Business details</h2>

          <p className="business-desc">
            Essential information for legal and operational compliance.
          </p>

          {/* Form Card */}
          <div className="business-card">
            {/* Store Name */}
            <div className="form-group">
              <label>Store Name</label>

              <input type="text" value="Apothecary" />
            </div>

            {/* Address */}
            <div className="form-group">
              <label>Warehouse Address</label>

              <input
                type="text"
                value="Plot 42, Green Belt Industrial Area, Jaipur, Rajasthan - 302001"
              />
            </div>

            {/* GST + Category */}
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

            {/* Upload Box */}
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

          {/* BANK TAB */}
        {/* BANK TAB */}
{activeTab === "bank" && (() => {

  const bankAccounts = [
    {
      id: 1,
      bankName: "State Bank of India",
      accountNumber: "**** 6011",
      accountType: "Saving Account",
      tag: "Primary"
    },
    {
      id: 2,
      bankName: "HDFC Bank",
      accountNumber: "**** 8172",
      accountType: "Business Account",
      tag: "Secondary"
    }
  ];

  return (
    <>
      <div className="bank-header-top">

        <div>
          <h2>Bank info</h2>

          <p className="business-desc">
            Where your earnings will be deposited every fortnight.
          </p>
        </div>

        <button className="add-card-btn">
          + Add New Card
        </button>

      </div>

      <div className="bank-card-container">

        <p className="linked-account-text">
          Linked Account
        </p>

        {/* Cards Row */}
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

                <span>
                  {item.accountType}
                </span>

                <button>
                  Edit
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Secure Box */}
        <div className="secure-box">

          <h4>
            🛡 Secure Processing
          </h4>

          <p>
            All bank data is encrypted with bank-grade
            256-bit SSL. Veda Merchant never stores your
            full account credentials.
          </p>

        </div>

      </div>
    </>
  );

})()}

          {/* Buttons */}
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