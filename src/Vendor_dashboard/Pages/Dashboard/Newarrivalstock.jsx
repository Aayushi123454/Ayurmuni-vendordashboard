import { useState } from "react";
import "./Newarrivalstock.css";
import image4 from "../../../Assests/image 4.png"

const defaultProducts = [
  { sku: "SKU-300", name: "Aloevera Gel", qty: 200, price: 12000 },
  { sku: "SKU-300", name: "Face Cream", qty: 240, price: 12000 },
  { sku: "SKU-300", name: "Amla Powder", qty: 500, price: 12000 },
  { sku: "SKU-300", name: "Cough Syrup", qty: 100, price: 12000 },
  { sku: "SKU-300", name: "Face Cream", qty: 600, price: 12000 },
];

export default function NewlyArrivedStock({ products = defaultProducts }) {
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState("");

  useState(() => {
    setError("error ");
    setTimeout(() => {
      setError("");
      setLoading(false);
    }, 1500);
  }, []);

  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="stock-wrap">
      <h2 className="header2">Newly Arrived Stock</h2>
      <br />
      <table className="sales-table">
        <thead>
          <tr>
            <th>Products</th>
            <th className="right">Qty</th>
            <th className="right">Price</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
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
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={index}
              >
                <td>
                  <div className="sale-product-cell">
                    <div className="sale-product-img"> <img src={image4} /></div>
                    <div className="sale-product-info">
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
            ))) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}