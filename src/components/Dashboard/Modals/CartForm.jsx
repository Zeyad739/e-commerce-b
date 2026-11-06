import { Modal, Button, Table, Badge, Row, Col } from "react-bootstrap";
import { FaReceipt } from "react-icons/fa";

export default function CartForm({ show, onHide, cartData }) {
  if (!cartData) return null;

  const {
    id,
    userId,
    products = [],
    total,
    discountedTotal,
    totalProducts,
    totalQuantity,
  } = cartData;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <FaReceipt className="text-primary" />
          <span>Cart #{id} Details</span>
          <Badge bg="secondary" className="ms-2 small">
            User #{userId}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* KPI Quick info */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <div className="p-3 border rounded-3 text-center bg-body-tertiary">
              <span className="d-block small text-muted">Total Items</span>
              <strong className="fs-5">{totalProducts}</strong>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-3 border rounded-3 text-center bg-body-tertiary">
              <span className="d-block small text-muted">Total Quantity</span>
              <strong className="fs-5">{totalQuantity}</strong>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-3 border rounded-3 text-center bg-body-tertiary">
              <span className="d-block small text-muted">Gross Total</span>
              <strong className="fs-5 text-muted">${total}</strong>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-3 border rounded-3 text-center bg-body-tertiary">
              <span className="d-block small text-muted">Net Total</span>
              <strong className="fs-5 text-success">${discountedTotal}</strong>
            </div>
          </Col>
        </Row>

        <h6 className="fw-bold mb-3">Cart Items Breakdown</h6>
        <div className="border rounded-3 overflow-hidden">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th className="text-center">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Discount</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={prod.thumbnail || "https://dummyjson.com/image/50x50"}
                        alt={prod.title}
                        className="rounded border object-fit-contain bg-light"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span className="fw-medium small text-truncate" style={{ maxWidth: "200px" }}>
                        {prod.title}
                      </span>
                    </div>
                  </td>
                  <td className="text-center small">${prod.price}</td>
                  <td className="text-center small fw-bold">×{prod.quantity}</td>
                  <td className="text-center small text-danger">
                    -{prod.discountPercentage}%
                  </td>
                  <td className="text-end small fw-bold text-success">
                    ${prod.discountedTotal || (prod.price * prod.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
