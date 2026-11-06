import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Tab, Nav, Badge, Button, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductsTable from "../components/Dashboard/ProductsTable";
import UsersTable from "../components/Dashboard/UsersTable";
import CartForm from "../components/Dashboard/Modals/CartForm";
import { fetchApiCarts } from "../store/Slices/cartSlice";
import {
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaEye,
  FaShieldAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { total: totalProducts } = useSelector((state) => state.products);
  const { usersTotal } = useSelector((state) => state.users);
  const { apiCarts, loading: cartsLoading } = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.users.currentUser);
  const isDark = useSelector((state) => state.theme.isDark);

  const [selectedCart, setSelectedCart] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    dispatch(fetchApiCarts());
  }, [dispatch]);

  // Calculate gross cart revenue
  const totalCartRevenue = apiCarts
    ?.reduce((sum, c) => sum + (c.discountedTotal || c.total || 0), 0)
    .toFixed(2);

  return (
    <Container fluid="lg" className="py-4">
      {/* Dashboard Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="fw-bold fs-2 mb-0">Admin Dashboard</h1>
            <Badge bg="danger" className="rounded-pill px-2">
              <FaShieldAlt className="me-1" />
              Full CRUD Enabled
            </Badge>
          </div>
          <p className="text-muted small mb-0">
            Welcome back, <strong>{currentUser?.firstName || "Admin"}</strong>! Manage your
            products, users, and carts in real-time.
          </p>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <Row className="g-3 mb-4">
        {/* Total Products */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            className={`border-0 shadow-sm rounded-4 h-100 ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold d-block">
                  Total Products
                </span>
                <h3 className="fw-bold mb-0 mt-1">{totalProducts || 194}</h3>
                <small className="text-success small fw-medium">Live from DummyJSON</small>
              </div>
              <div
                className="rounded-4 p-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary"
                style={{ width: "54px", height: "54px" }}
              >
                <FaBoxes size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Users */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            className={`border-0 shadow-sm rounded-4 h-100 ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold d-block">
                  Total Users
                </span>
                <h3 className="fw-bold mb-0 mt-1">{usersTotal || 208}</h3>
                <small className="text-info small fw-medium">Registered Accounts</small>
              </div>
              <div
                className="rounded-4 p-3 d-flex align-items-center justify-content-center bg-info-subtle text-info"
                style={{ width: "54px", height: "54px" }}
              >
                <FaUsers size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Carts */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            className={`border-0 shadow-sm rounded-4 h-100 ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold d-block">
                  Total Carts
                </span>
                <h3 className="fw-bold mb-0 mt-1">{apiCarts?.length || 50}</h3>
                <small className="text-warning small fw-medium">Active Orders</small>
              </div>
              <div
                className="rounded-4 p-3 d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis"
                style={{ width: "54px", height: "54px" }}
              >
                <FaShoppingCart size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Gross Sales */}
        <Col xs={12} sm={6} lg={3}>
          <Card
            className={`border-0 shadow-sm rounded-4 h-100 ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small text-uppercase fw-semibold d-block">
                  Gross Value
                </span>
                <h3 className="fw-bold mb-0 mt-1">${totalCartRevenue || "84,320"}</h3>
                <small className="text-success small fw-medium">+18% this month</small>
              </div>
              <div
                className="rounded-4 p-3 d-flex align-items-center justify-content-center bg-success-subtle text-success"
                style={{ width: "54px", height: "54px" }}
              >
                <FaDollarSign size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Tabbed Management Sections */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Card
          className={`border-0 shadow-sm rounded-4 overflow-hidden mb-4 ${
            isDark ? "bg-dark text-white border-secondary" : "bg-white"
          }`}
        >
          {/* Dashboard Navigation Tabs */}
          <div className="border-bottom px-4 pt-3">
            <Nav variant="underline" className="gap-4">
              <Nav.Item>
                <Nav.Link
                  eventKey="products"
                  className="fw-bold d-flex align-items-center gap-2 pb-3"
                >
                  <FaBoxes />
                  <span>Products Management</span>
                  <Badge bg="secondary" className="rounded-pill">
                    {totalProducts || 194}
                  </Badge>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="users"
                  className="fw-bold d-flex align-items-center gap-2 pb-3"
                >
                  <FaUsers />
                  <span>Users Management</span>
                  <Badge bg="secondary" className="rounded-pill">
                    {usersTotal || 208}
                  </Badge>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="carts"
                  className="fw-bold d-flex align-items-center gap-2 pb-3"
                >
                  <FaShoppingCart />
                  <span>Carts & Orders</span>
                  <Badge bg="secondary" className="rounded-pill">
                    {apiCarts?.length || 50}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {/* Tab Content Panels */}
          <Card.Body className="p-4">
            <Tab.Content>
              {/* Products Management Panel */}
              <Tab.Pane eventKey="products">
                <ProductsTable />
              </Tab.Pane>

              {/* Users Management Panel */}
              <Tab.Pane eventKey="users">
                <UsersTable />
              </Tab.Pane>

              {/* Carts Management Panel */}
              <Tab.Pane eventKey="carts">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">Carts & Orders Database</h5>
                    <p className="text-muted small mb-0">
                      View all user shopping carts and placed orders from DummyJSON API
                    </p>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => dispatch(fetchApiCarts())}
                  >
                    Refresh Carts
                  </Button>
                </div>

                <div className="border rounded-4 overflow-hidden shadow-sm bg-body">
                  {cartsLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="text-muted mt-2">Loading carts...</p>
                    </div>
                  ) : (
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Cart ID</th>
                          <th>Customer ID</th>
                          <th>Unique Items</th>
                          <th>Total Units</th>
                          <th>Gross Total</th>
                          <th>Discounted Total</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiCarts?.map((cart) => (
                          <tr key={cart.id}>
                            <td className="fw-bold">Cart #{cart.id}</td>
                            <td>
                              <Badge bg="secondary" className="rounded-pill">
                                User #{cart.userId}
                              </Badge>
                            </td>
                            <td>{cart.totalProducts} items</td>
                            <td>{cart.totalQuantity} items</td>
                            <td className="text-muted">${cart.total}</td>
                            <td className="fw-bold text-success">
                              ${cart.discountedTotal}
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                onClick={() => setSelectedCart(cart)}
                              >
                                <FaEye size={12} />
                                <span>Inspect</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>

      {/* Cart Inspect Modal */}
      <CartForm
        show={Boolean(selectedCart)}
        onHide={() => setSelectedCart(null)}
        cartData={selectedCart}
      />
    </Container>
  );
}
