import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Pagination,
  Spinner,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import {
  fetchAllUsers,
  deleteUser,
  deleteUserLocally,
  addUserLocally,
  setUsersPage,
} from "../../store/Slices/usersSlice";
import { useNotification } from "../../utils/useNotification";
import {
  FaSearch,
  FaTimes,
  FaEye,
  FaTrash,
  FaUserPlus,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

export default function UsersTable() {
  const dispatch = useDispatch();
  const notify = useNotification();
  const { usersList, usersTotal, usersSkip, usersLimit, usersLoading } =
    useSelector((state) => state.users);

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    role: "user",
    company: "",
  });

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        limit: usersLimit,
        skip: usersSkip,
        query: submittedSearch,
      })
    );
  }, [dispatch, usersLimit, usersSkip, submittedSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearch(search);
    dispatch(setUsersPage(0));
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      dispatch(deleteUserLocally(id));
      dispatch(deleteUser(id));
      notify.success(`User "${name}" removed.`, "User Deleted");
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.firstName || !newUserData.email) return;

    const created = {
      ...newUserData,
      id: Date.now(),
      image: `https://dummyjson.com/icon/${newUserData.username || "user"}/128`,
      age: 28,
      address: { city: "New York", address: "Central Ave" },
      company: { name: newUserData.company || "Independent" },
    };

    dispatch(addUserLocally(created));
    notify.success(`User "${created.firstName}" created successfully!`, "User Created");
    setShowAddUserModal(false);
    setNewUserData({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
      role: "user",
      company: "",
    });
  };

  const currentPage = Math.floor(usersSkip / usersLimit);
  const totalPages = Math.ceil(usersTotal / usersLimit) || 1;

  return (
    <div>
      {/* Header Search & Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <Form onSubmit={handleSearchSubmit} className="flex-grow-1" style={{ maxWidth: "340px" }}>
          <InputGroup size="sm" className="rounded-pill overflow-hidden border">
            <InputGroup.Text className="bg-transparent border-0 ps-3">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users by name, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none"
            />
            {search && (
              <Button
                variant="link"
                size="sm"
                className="text-muted text-decoration-none pe-2"
                onClick={() => {
                  setSearch("");
                  setSubmittedSearch("");
                  dispatch(setUsersPage(0));
                }}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Form>

        <Button
          variant="primary"
          onClick={() => setShowAddUserModal(true)}
          className="rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
        >
          <FaUserPlus size={14} />
          <span>Add New User</span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="border rounded-4 overflow-hidden shadow-sm bg-body">
        {usersLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading users data...</p>
          </div>
        ) : usersList.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No users found.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>User</th>
                <th>Name & Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Company / City</th>
                <th className="text-center" style={{ width: "120px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.image || `https://dummyjson.com/icon/${user.username}/128`}
                      alt={user.firstName}
                      className="rounded-circle border object-fit-cover bg-light"
                      style={{ width: "42px", height: "42px" }}
                      onError={(e) => {
                        e.target.src = "https://dummyjson.com/image/100x100?text=User";
                      }}
                    />
                  </td>
                  <td>
                    <strong className="d-block">
                      {user.firstName} {user.lastName}
                    </strong>
                    <small className="text-muted">@{user.username}</small>
                  </td>
                  <td className="small text-muted">{user.email}</td>
                  <td className="small text-muted">{user.phone}</td>
                  <td>
                    <Badge
                      bg={user.role === "admin" ? "danger" : "secondary"}
                      className="rounded-pill text-capitalize px-2"
                    >
                      {user.role || "Customer"}
                    </Badge>
                  </td>
                  <td className="small">
                    <div>{user.company?.name || "Independent"}</div>
                    <span className="text-muted">{user.address?.city || "Unknown City"}</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => setSelectedUser(user)}
                        title="View user details"
                      >
                        <FaEye size={13} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() =>
                          handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)
                        }
                        title="Delete user"
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="small text-muted">
            Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong> (
            {usersTotal} users registered)
          </span>
          <Pagination className="mb-0 shadow-sm rounded-pill overflow-hidden">
            <Pagination.Prev
              disabled={currentPage === 0}
              onClick={() =>
                dispatch(setUsersPage(Math.max(0, currentPage - 1)))
              }
            />
            <Pagination.Item active>{currentPage + 1}</Pagination.Item>
            <Pagination.Next
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                dispatch(setUsersPage(currentPage + 1))
              }
            />
          </Pagination>
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        show={Boolean(selectedUser)}
        onHide={() => setSelectedUser(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <FaUserCircle className="text-primary" />
            <span>User Profile Details</span>
          </Modal.Title>
        </Modal.Header>
        {selectedUser && (
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <img
                src={
                  selectedUser.image ||
                  `https://dummyjson.com/icon/${selectedUser.username}/128`
                }
                alt={selectedUser.firstName}
                className="rounded-circle border p-1 shadow-sm mb-2"
                style={{ width: "90px", height: "90px" }}
              />
              <h5 className="fw-bold mb-1">
                {selectedUser.firstName} {selectedUser.lastName}
              </h5>
              <p className="text-muted small mb-0">@{selectedUser.username}</p>
              <Badge bg="primary" className="mt-2 text-capitalize rounded-pill">
                {selectedUser.role || "User"}
              </Badge>
            </div>

            <Row className="g-3 small">
              <Col xs={12}>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FaEnvelope className="text-primary" />
                  <span>Email:</span>
                  <strong className="text-body ms-auto">{selectedUser.email}</strong>
                </div>
              </Col>
              <Col xs={12}>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FaPhone className="text-primary" />
                  <span>Phone:</span>
                  <strong className="text-body ms-auto">{selectedUser.phone}</strong>
                </div>
              </Col>
              <Col xs={12}>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FaBuilding className="text-primary" />
                  <span>Company:</span>
                  <strong className="text-body ms-auto">
                    {selectedUser.company?.name || "N/A"}
                  </strong>
                </div>
              </Col>
              <Col xs={12}>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>Address:</span>
                  <strong className="text-body ms-auto">
                    {selectedUser.address?.address}, {selectedUser.address?.city}
                  </strong>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setSelectedUser(null)}
            className="rounded-pill px-4"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <FaUserPlus className="text-primary" />
            <span>Create New User</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateUser}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={newUserData.firstName}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, firstName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUserData.lastName}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, lastName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Username *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={newUserData.username}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, username: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUserData.phone}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, phone: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Role</Form.Label>
                  <Form.Select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddUserModal(false)}
              className="rounded-pill px-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-pill px-4 shadow"
            >
              Add User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
