import React, { useState } from "react";
import { Globe } from "lucide-react";
import "./AddProduct.css";

export default function AddProduct() {
  const [selectedType, setSelectedType] = useState("In-House");

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Product Details",
    "Variants",
    "Package Method",
    "Payment Reimbursement",
    "Review & Submit",
  ];

  const healthTags = [
    "Urology",
    "Dermat",
    "Gastrology",
    "Health",
    "Diabetes",
  ];

  return (
    <div className="notification-page">

      <div className="page-header">
        <button className="back-btn">← Back</button>

        <h1>Add new Product</h1>

        <p>
          Create a new listing in your botanical collection.
          Ensure all ingredients and dosha types are accurately cataloged.
        </p>
      </div>

     
      <div className="stepper">
        {steps.map((step, index) => (
          <div
            className="step-item"
            key={index}
            onClick={() => setActiveStep(index)}
          >
            <div
              className={`step-circle ${
                index <= activeStep ? "" : ""
              }`}
            >
              <Globe size={16} />
            </div>

            <span className={index <= activeStep ? "" : ""}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="form-card">
        <h3>Select Product Or Add Product</h3>

        <div className="full-width">
          <label>PRODUCT NAME</label>

          <input
            type="text"
            placeholder="eg. Organic Ashwagandha Root Powder"
          />
        </div>
      </div>

      <div className="form-card">

        <h2>Product Information</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>CATEGORY</label>

            <select>
              <option>Select Category</option>
            </select>
          </div>

          <div className="form-group">
            <label>BRAND NAME</label>

            <input type="text" placeholder="eg. ayurMynk" />
          </div>

          <div className="form-group">
            <label>MANUFACTURER</label>

            <input type="text" placeholder="eg. xyz pvt ltd" />
          </div>

          <div className="form-group">
            <label>ORIGIN</label>

            <input type="text" placeholder="eg. ayurMynk" />
          </div>

          <div className="form-group full">
            <label>SHORT DESCRIPTION</label>

            <textarea placeholder="eg. add short description"></textarea>
          </div>

          <div className="form-group full">
            <label>FULL DESCRIPTION</label>

            <textarea placeholder="eg. add full description"></textarea>
          </div>

          {/* <div className="form-group full">
            <label>HOW TO USE</label>

            <textarea placeholder="eg. add usage instructions"></textarea>
          </div> */}

          <div className="form-group">
            <label>BENEFITS</label>

            <textarea placeholder="eg. add benefits"></textarea>
          </div>

          <div className="form-group">
            {/* <label>SELECT TREATMENT TYPE</label>

            <select>
              <option>Select Category</option>
            </select> */}
            <label>SIDE EFFECTS</label>

            <textarea placeholder="eg. add side effects"></textarea>
          </div>

          <div className="form-group">
            <label>COMPOSITIONS</label>

            <textarea placeholder="eg. add compositions"></textarea>
          </div>

        

          <div className="form-group">
            <label>DOSAGES</label>

            <textarea placeholder="eg. add dosage"></textarea>
          </div>

         

          <div className="form-group">
            <label>SAFETY INFORMATION</label>

            <textarea placeholder="eg. add safety info"></textarea>
          </div>

            <div className="form-group">
            <label>HOW TO USE</label>

            <textarea placeholder="eg. add safety info"></textarea>
          </div>
           <div className="form-group">
            <label>AYUSH LICENSE NUMBER</label>

            <input type="text" placeholder="eg. ay12345" />
          </div>

          <div className="form-group">
            <label>GST NUMBER</label>

            <input type="text" placeholder="eg. gst12345" />
          </div>
           <div className="form-group">
            <label>SIN NUMBER</label>

            <input type="text" placeholder="eg. sin1233" />
          </div>

           <div className="form-group">
            <label>MODEL NUMBER</label>

            <input type="text" placeholder="eg. 456677" />
          </div>
        </div>

        {/* Product Type */}
        <div className="product-type">
          <label>TYPE</label>

          <div className="radio-group">
            {["In-House", "Rebranded", "Active"].map((item) => (
              <label className="radio-item" key={item}>
                <input
                  type="radio"
                  checked={selectedType === item}
                  onChange={() => setSelectedType(item)}
                />

                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="health-card">
        <h3>Health Concern (Multi-select)</h3>

        <div className="tag-wrapper">
          {healthTags.map((tag, index) => (
            <button
              className={`tag-btn ${
                index === 1 ? "selected" : ""
              }`}
              key={index}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}