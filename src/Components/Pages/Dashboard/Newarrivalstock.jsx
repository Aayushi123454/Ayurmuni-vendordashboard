import { useState } from "react";
import "./Newarrivalstock.css";
import image4 from "../../../Assests/image 4.png"

const defaultProducts = [
  { sku: "SKU-300", name: "Aloevera Gel", qty: 200, price: 12000 },
  { sku: "SKU-300", name: "Face Cream",   qty: 240, price: 12000 },
  { sku: "SKU-300", name: "Amla Powder",  qty: 500, price: 12000 },
  { sku: "SKU-300", name: "Cough Syrup",  qty: 100, price: 12000 },
  { sku: "SKU-300", name: "Face Cream",   qty: 600, price: 12000 },
];

export default function NewlyArrivedStock({ products = defaultProducts }) {


  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="stock-wrap">
      <h2 className="header2">Newly Arrived Stock</h2>

      <table className="stock-table">
        <colgroup>
          <col className="col-product" />
          <col className="col-qty" />
          <col className="col-price" />
        </colgroup>
        <thead>
          <tr>
            <th>Products</th>
            <th className="right">Qty</th>
            <th className="right">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
            
            
            >
              <td>
                <div className="product-cell">
                  <div className="product-img"> <img src={image4}/></div>
                  <div className="product-info1">
                    <span className="sku">{product.sku}</span>
                    <span className="product-name">{product.name}</span>
                  </div>
                </div>
              </td>
              <td className="qty-cell">
               <span className="qty-plain">{product.qty}</span>
              </td>
              <td className="price-cell">
                Rs. {product.price.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
}