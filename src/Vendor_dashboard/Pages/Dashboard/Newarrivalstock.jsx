import "./Newarrivalstock.css";
import image4 from "../../../Assests/image 4.png";

export default function NewlyArrivedStock({ products = [], loading = false, error = "" }) {
  const total = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="stock-wrap">
      <h2 className="header2">Recent Stock Updates</h2>
      <br />
      <table className="sales-table">
        <thead>
          <tr>
            <th>Products</th>
            <th className="right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <tr key={i}>
                <td colSpan="2"><div className="sale-product-cell skeleton-row"></div></td>
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan="2" style={{ color: "red", textAlign: "center" }}>{error}</td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>
                  <div className="sale-product-cell">
                    <div className="sale-product-img"><img src={image4} alt="" /></div>
                    <div className="sale-product-info">
                      <span className="sku">{product.sku}</span>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </div>
                </td>
                <td className="qty-cell">
                  <span className="qty-plain">{product.qty}</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>No stock records yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      {products.length > 0 && total > 0 && (
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
          Showing latest inventory updates from your catalog.
        </p>
      )}
    </div>
  );
}
