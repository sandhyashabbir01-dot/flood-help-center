import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

const API = "https://flood-help-center-backend.vercel.app";

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ cart = [] }) {
  const isLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">Flood Help Center</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/affected-areas">Affected Areas</Link>
        <Link to="/emergency">Emergency</Link>
        <Link to="/help">Request Help</Link>

        <Link to="/products">
          Products 🛒{" "}
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {isLoggedIn ? (
          <Link to="/admin/dashboard">
            Admin Dashboard
          </Link>
        ) : (
          <Link to="/admin">Admin</Link>
        )}
      </div>
    </nav>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  return (
    <div className="page">
      <h1>Flood Help Center 🌊</h1>

      <p>
        Welcome to the Flood Help Center. Get emergency
        information, request help, and support flood-affected
        communities.
      </p>

      <div className="home-cards">
        <div className="card">
          <h2>🚨 Emergency Help</h2>
          <p>
            Find important emergency information and safety
            guidance.
          </p>
          <Link to="/emergency" className="button">
            Emergency
          </Link>
        </div>

        <div className="card">
          <h2>🆘 Request Help</h2>
          <p>
            Submit a request if you or someone needs flood
            assistance.
          </p>
          <Link to="/help" className="button">
            Request Help
          </Link>
        </div>

        <div className="card">
          <h2>🛒 Relief Products</h2>
          <p>
            Purchase relief products and emergency supplies.
          </p>
          <Link to="/products" className="button">
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AFFECTED AREAS
========================================================= */

function AffectedAreas() {
  return (
    <div className="page">
      <h1>Flood Affected Areas 🌊</h1>

      <div className="card">
        <h2>Punjab</h2>
        <p>
          Some areas of Punjab may be affected by flooding
          during heavy rainfall and river overflow.
        </p>
      </div>

      <div className="card">
        <h2>Sindh</h2>
        <p>
          Flood-affected communities may require food, clean
          water, medical assistance and shelter.
        </p>
      </div>

      <div className="card">
        <h2>Khyber Pakhtunkhwa</h2>
        <p>
          Communities in vulnerable areas should follow local
          emergency instructions.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMERGENCY
========================================================= */

function Emergency() {
  return (
    <div className="page">
      <h1>Emergency Information 🚨</h1>

      <div className="flood-safety-box">
        <h2>Flood Safety Tips</h2>

        <ul>
          <li>
            Move to a safe and elevated place if instructed.
          </li>
          <li>
            Stay away from floodwater whenever possible.
          </li>
          <li>
            Keep important documents in a safe place.
          </li>
          <li>
            Follow instructions from local authorities.
          </li>
          <li>Keep emergency supplies available.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Emergency Contacts</h2>

        <p>
          🚑 Rescue: <strong>1122</strong>
        </p>

        <p>
          🚓 Police: <strong>15</strong>
        </p>

        <p>
          🔥 Fire: <strong>16</strong>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HELP
========================================================= */

function Help() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    helpType: "Food",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API + "/help", formData);

      alert(
        "Your help request has been submitted successfully."
      );

      setFormData({
        name: "",
        phone: "",
        area: "",
        helpType: "Food",
        message: "",
      });
    } catch (error) {
      console.error("Help request error:", error);

      alert(
        "Help request could not be submitted. Please try again."
      );
    }
  };

  return (
    <div className="page">
      <h1>Request Help 🆘</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Affected Area"
          value={formData.area}
          onChange={handleChange}
          required
        />

        <select
          name="helpType"
          value={formData.helpType}
          onChange={handleChange}
        >
          <option value="Food">Food</option>
          <option value="Water">Water</option>
          <option value="Medical">Medical</option>
          <option value="Shelter">Shelter</option>
          <option value="Rescue">Rescue</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="message"
          placeholder="Describe the help you need"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit" className="button">
          Submit Help Request
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   PRODUCTS + INVENTORY
========================================================= */

function Products({
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  inventory,
  refreshInventory,
}) {
  const [showCheckoutForm, setShowCheckoutForm] =
    useState(false);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const products = [
    {
      id: 1,
      name: "Food Relief Package",
      price: 2000,
      icon: "🥫",
      description:
        "Essential food supplies for families affected by flooding.",
    },
    {
      id: 2,
      name: "Clean Water Pack",
      price: 500,
      icon: "💧",
      description:
        "Clean drinking water supplies for emergency situations.",
    },
    {
      id: 3,
      name: "Medical First Aid Kit",
      price: 1500,
      icon: "🩹",
      description:
        "Basic first aid supplies for emergency needs.",
    },
    {
      id: 4,
      name: "Emergency Shelter Kit",
      price: 3000,
      icon: "🏕️",
      description:
        "Basic shelter supplies for families needing temporary support.",
    },
    {
      id: 5,
      name: "Emergency Essentials Kit",
      price: 2500,
      icon: "🎒",
      description:
        "A collection of useful emergency and relief supplies.",
    },
    {
      id: 6,
      name: "Hygiene Supplies Pack",
      price: 1000,
      icon: "🧼",
      description:
        "Essential hygiene items for flood-affected communities.",
    },
  ];

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      items: cart,
      totalAmount: cartTotal,
    };

    try {
      await axios.post(API + "/orders", orderData);

      /*
        Order successfully placed.
        Backend has already updated:
        sold + quantity
        remaining - quantity
      */

      await refreshInventory();

      alert(
        `Thank you ${customerDetails.name}! Your order has been placed successfully.\nIt is now sent to the Admin Dashboard.`
      );

      clearCart();

      setShowCheckoutForm(false);

      setCustomerDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error("Backend /orders post error:", error);

      const backendMessage =
        error?.response?.data?.message;

      alert(
        backendMessage ||
          "Order could not be placed. Please try again."
      );
    }
  };

  return (
    <div className="page">
      <h1>Relief Products 🛒</h1>

      <p>
        Purchase essential relief products and supplies.
      </p>

      {/* ================= INVENTORY INFO ================= */}

      <div className="card">
        <h2>📦 Inventory Information</h2>

        <p>
          Product quantity is tracked below. Sold and
          remaining quantities are updated automatically after
          each successful order.
        </p>
      </div>

      {/* ================= CART ================= */}

      <div className="cart-box">
        <h2>Your Cart 🛒</h2>

        <p>
          Cart Items: <strong>{cartCount}</strong>
        </p>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => {
              const productInventory =
                inventory[item.id];

              const remaining =
                productInventory?.remaining ?? 0;

              return (
                <div className="cart-item" key={item.id}>
                  <span>
                    {item.icon} {item.name}
                  </span>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, -1)
                      }
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, 1)
                      }
                      disabled={
                        item.quantity >= remaining
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    Rs.{" "}
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <div className="cart-total">
              Total: Rs.{" "}
              {cartTotal.toLocaleString()}
            </div>

            <button
              type="button"
              className="button"
              onClick={() =>
                setShowCheckoutForm(true)
              }
            >
              Checkout 🛒
            </button>
          </>
        )}
      </div>

      {/* ================= CHECKOUT ================= */}

      {showCheckoutForm && (
        <div className="checkout-form-container">
          <h2>Shipping & Contact Information</h2>

          <form
            className="contact-form"
            onSubmit={handleOrderSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={customerDetails.name}
              onChange={handleInputChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={customerDetails.email}
              onChange={handleInputChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customerDetails.phone}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="address"
              placeholder="Delivery Address"
              value={customerDetails.address}
              onChange={handleInputChange}
              required
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                className="button"
              >
                Confirm & Place Order
              </button>

              <button
                type="button"
                className="button delete-button"
                onClick={() =>
                  setShowCheckoutForm(false)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= PRODUCTS ================= */}

      <div className="products-grid">
        {products.map((product) => {
          const productInventory =
            inventory[product.id] || {
              added: 0,
              sold: 0,
              remaining: 0,
            };

          const isOutOfStock =
            productInventory.remaining <= 0;

          return (
            <div
              className="product-card"
              key={product.id}
            >
              <div className="product-icon">
                {product.icon}
              </div>

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <h3>
                Rs.{" "}
                {product.price.toLocaleString()}
              </h3>

              {/* INVENTORY */}

              <div className="product-inventory">
                <p>
                  📦 Added Quantity:{" "}
                  <strong>
                    {productInventory.added}
                  </strong>
                </p>

                <p>
                  🛒 Sold:{" "}
                  <strong>
                    {productInventory.sold}
                  </strong>
                </p>

                <p>
                  📊 Remaining:{" "}
                  <strong>
                    {productInventory.remaining}
                  </strong>
                </p>
              </div>

              {isOutOfStock ? (
                <button
                  className="button"
                  disabled
                  style={{
                    marginTop: "10px",
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  className="button"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  Add to Cart 🛒
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function About() {
  return (
    <div className="page">
      <h1>About Flood Help Center</h1>

      <div className="card">
        <p>
          Flood Help Center is designed to provide useful
          flood information, emergency guidance, help requests
          and relief products.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API + "/contact", formData);

      alert("Your message has been sent successfully.");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact error:", error);

      alert(
        "Message could not be sent. Please try again."
      );
    }
  };

  return (
    <div className="page">
      <h1>Contact Us 📩</h1>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="button"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      sessionStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      navigate("/admin/dashboard");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="page">
      <h1>Admin Login 🔐</h1>

      <form
        className="contact-form"
        onSubmit={handleLogin}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button
          type="submit"
          className="button"
        >
          Login
        </button>
      </form>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({});

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] =
    useState("");

  const [filterType, setFilterType] =
    useState("All");

  /* ================= PRODUCTS ================= */

  const inventoryProducts = [
    {
      id: 1,
      name: "Food Relief Package",
      icon: "🥫",
    },
    {
      id: 2,
      name: "Clean Water Pack",
      icon: "💧",
    },
    {
      id: 3,
      name: "Medical First Aid Kit",
      icon: "🩹",
    },
    {
      id: 4,
      name: "Emergency Shelter Kit",
      icon: "🏕️",
    },
    {
      id: 5,
      name: "Emergency Essentials Kit",
      icon: "🎒",
    },
    {
      id: 6,
      name: "Hygiene Supplies Pack",
      icon: "🧼",
    },
  ];

  /* ================= LOAD INVENTORY ================= */

  const loadInventory = async () => {
    try {
      const response =
        await axios.get(API + "/inventory");

      const inventoryData =
        Array.isArray(response.data)
          ? response.data
          : [];

      const inventoryObject = {};

      inventoryData.forEach((item) => {
        inventoryObject[item.productId] = {
          added: item.added || 0,
          sold: item.sold || 0,
          remaining: item.remaining || 0,
        };
      });

      setInventory(inventoryObject);
    } catch (error) {
      console.error(
        "Inventory loading error:",
        error
      );

      alert(
        "Inventory could not be loaded."
      );
    }
  };

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        requestsResponse,
        ordersResponse,
        inventoryResponse,
      ] = await Promise.all([
        axios.get(API + "/help"),
        axios.get(API + "/orders"),
        axios.get(API + "/inventory"),
      ]);

      setRequests(
        Array.isArray(requestsResponse.data)
          ? requestsResponse.data
          : []
      );

      setOrders(
        Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : []
      );

      const inventoryData =
        Array.isArray(inventoryResponse.data)
          ? inventoryResponse.data
          : [];

      const inventoryObject = {};

      inventoryData.forEach((item) => {
        inventoryObject[item.productId] = {
          added: item.added || 0,
          sold: item.sold || 0,
          remaining: item.remaining || 0,
        };
      });

      setInventory(inventoryObject);
    } catch (error) {
      console.error(
        "Admin data loading error:",
        error
      );

      alert(
        "Could not load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn =
      sessionStorage.getItem(
        "adminLoggedIn"
      ) === "true";

    if (!loggedIn) {
      navigate("/admin");
      return;
    }

    loadData();
  }, []);

  /* ================= DELETE REQUEST ================= */

  const deleteRequest = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this request?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        API + "/help/" + id
      );

      setRequests((previous) =>
        previous.filter(
          (request) =>
            request._id !== id
        )
      );

      alert("Request deleted successfully.");
    } catch (error) {
      console.error(
        "Delete request error:",
        error
      );

      alert(
        "Request could not be deleted."
      );
    }
  };

  /* ================= REQUEST STATUS ================= */

  const updateRequestStatus = async (
    id,
    newStatus
  ) => {
    try {
      await axios.put(
        API + "/help/" + id + "/status",
        {
          status: newStatus,
        }
      );

      setRequests((previous) =>
        previous.map((request) =>
          request._id === id
            ? {
                ...request,
                status: newStatus,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Update request status error:",
        error
      );

      alert(
        "Request status could not be updated."
      );
    }
  };

  /* ================= DELETE ORDER ================= */

  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        API + "/orders/" + id
      );

      setOrders((previous) =>
        previous.filter(
          (order) =>
            order._id !== id
        )
      );

      /*
        Refresh inventory after deleting an order.
      */

      await loadInventory();

      alert("Order deleted successfully.");
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      alert(
        "Order could not be deleted."
      );
    }
  };

  /* ================= ORDER STATUS ================= */

  const updateOrderStatus = async (
    id,
    newStatus
  ) => {
    try {
      await axios.put(
        API + "/orders/" + id + "/status",
        {
          status: newStatus,
        }
      );

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      alert(
        "Order status could not be updated."
      );
    }
  };

  /* ================= SEARCH FILTER ================= */

  const filteredRequests = requests.filter(
    (request) => {
      const search =
        searchText.toLowerCase();

      const matchesSearch =
        (request.name || "")
          .toLowerCase()
          .includes(search) ||
        (request.area || "")
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        filterType === "All" ||
        request.helpType === filterType;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  /* ================= COUNTS ================= */

  const foodCount = requests.filter(
    (r) => r.helpType === "Food"
  ).length;

  const waterCount = requests.filter(
    (r) => r.helpType === "Water"
  ).length;

  const medicalCount = requests.filter(
    (r) => r.helpType === "Medical"
  ).length;

  const shelterCount = requests.filter(
    (r) => r.helpType === "Shelter"
  ).length;

  const pendingCount =
    requests.filter(
      (r) =>
        (r.status || "Pending") ===
        "Pending"
    ).length +
    orders.filter(
      (o) =>
        (o.status || "Pending") ===
        "Pending"
    ).length;

  const processingCount =
    requests.filter(
      (r) =>
        r.status === "In Progress" ||
        r.status === "Processing"
    ).length +
    orders.filter(
      (o) =>
        o.status === "In Progress" ||
        o.status === "Processing"
    ).length;

  const completedCount =
    requests.filter(
      (r) =>
        r.status === "Completed"
    ).length +
    orders.filter(
      (o) =>
        o.status === "Completed"
    ).length;

  const receivedCount =
    orders.filter(
      (o) =>
        (o.status || "Received") ===
        "Received"
    ).length;

  const shippedCount =
    orders.filter(
      (o) =>
        o.status === "Shipped"
    ).length;

  /* ================= INVENTORY TOTALS ================= */

  const totalAdded = Object.values(
    inventory
  ).reduce(
    (total, item) =>
      total + (item.added || 0),
    0
  );

  const totalSold = Object.values(
    inventory
  ).reduce(
    (total, item) =>
      total + (item.sold || 0),
    0
  );

  const totalRemaining =
    Object.values(inventory).reduce(
      (total, item) =>
        total + (item.remaining || 0),
      0
    );

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    sessionStorage.removeItem(
      "adminLoggedIn"
    );

    navigate("/admin");
  };

  return (
    <div className="page">
      {/* ================= HEADER ================= */}

      <div className="section-heading">
        <div>
          <h1>Admin Dashboard 🔐</h1>
          <p>
            Manage help requests, orders and
            inventory.
          </p>
        </div>

        <button
          className="button delete-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="admin-search-filter">
        <input
          type="text"
          placeholder="Search by name or area..."
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value)
          }
        >
          <option value="All">All Types</option>
          <option value="Food">Food</option>
          <option value="Water">Water</option>
          <option value="Medical">Medical</option>
          <option value="Shelter">Shelter</option>
          <option value="Rescue">Rescue</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="admin-summary">
        <div className="summary-card">
          <h3>Total Requests</h3>
          <strong>
            {requests.length}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Total Orders</h3>
          <strong>
            {orders.length}
          </strong>
        </div>

        <div className="summary-card status-card pending">
          <h3>🟡 Pending</h3>
          <strong>
            {pendingCount}
          </strong>
        </div>

        <div className="summary-card status-card processing">
          <h3>🔵 Processing</h3>
          <strong>
            {processingCount}
          </strong>
        </div>

        <div className="summary-card status-card completed">
          <h3>🟢 Completed</h3>
          <strong>
            {completedCount}
          </strong>
        </div>

        <div className="summary-card status-card received">
          <h3>📥 Received</h3>
          <strong>
            {receivedCount}
          </strong>
        </div>

        <div className="summary-card status-card shipped">
          <h3>🚚 Shipped</h3>
          <strong>
            {shippedCount}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Food</h3>
          <strong>
            {foodCount}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Water</h3>
          <strong>
            {waterCount}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Medical</h3>
          <strong>
            {medicalCount}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Shelter</h3>
          <strong>
            {shelterCount}
          </strong>
        </div>
      </div>

      {/* =====================================================
          INVENTORY SECTION
      ===================================================== */}

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <h2>📦 Inventory Management</h2>

            <p>
              Track added quantity, sold quantity
              and remaining stock.
            </p>
          </div>
        </div>

        <div className="admin-summary">
          <div className="summary-card">
            <h3>📦 Total Added</h3>
            <strong>
              {totalAdded}
            </strong>
          </div>

          <div className="summary-card">
            <h3>🛒 Total Sold</h3>
            <strong>
              {totalSold}
            </strong>
          </div>

          <div className="summary-card">
            <h3>📊 Remaining</h3>
            <strong>
              {totalRemaining}
            </strong>
          </div>
        </div>

        <div className="orders-grid">
          {inventoryProducts.map(
            (product) => {
              const item =
                inventory[product.id] || {
                  added: 0,
                  sold: 0,
                  remaining: 0,
                };

              return (
                <div
                  className="customer-order-card"
                  key={product.id}
                >
                  <div className="customer-order-header">
                    <div>
                      <span className="order-label">
                        INVENTORY
                      </span>

                      <h3>
                        {product.icon}{" "}
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="customer-info-grid">
                    <div className="info-box">
                      <span>
                        📦 Added
                      </span>

                      <strong>
                        {item.added}
                      </strong>
                    </div>

                    <div className="info-box">
                      <span>
                        🛒 Sold
                      </span>

                      <strong>
                        {item.sold}
                      </strong>
                    </div>

                    <div className="info-box">
                      <span>
                        📊 Remaining
                      </span>

                      <strong>
                        {item.remaining}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================================
          HELP REQUESTS
      ===================================================== */}

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <h2>🆘 Help Requests</h2>

            <p>
              Manage all customer help requests.
            </p>
          </div>

          <div>
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1
              ? "Request"
              : "Requests"}
          </div>
        </div>

        {loading ? (
          <p className="empty-message">
            Loading requests...
          </p>
        ) : filteredRequests.length === 0 ? (
          <p className="empty-message">
            No requests found.
          </p>
        ) : (
          <div className="orders-grid">
            {filteredRequests.map(
              (request, idx) => {
                const requestId =
                  request._id ||
                  request.id ||
                  idx;

                return (
                  <div
                    className="customer-order-card"
                    key={requestId}
                  >
                    <div className="customer-order-header">
                      <div>
                        <span className="order-label">
                          REQUEST
                        </span>

                        <h3>
                          👤 {request.name}
                        </h3>
                      </div>

                      <button
                        className="delete-order-btn"
                        onClick={() =>
                          deleteRequest(
                            requestId
                          )
                        }
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    <div className="customer-info-grid">
                      <div className="info-box">
                        <span>
                          📱 Phone
                        </span>

                        <strong>
                          {request.phone ||
                            "N/A"}
                        </strong>
                      </div>

                      <div className="info-box">
                        <span>
                          📍 Area
                        </span>

                        <strong>
                          {request.area ||
                            "N/A"}
                        </strong>
                      </div>

                      <div className="info-box">
                        <span>
                          🆘 Help Type
                        </span>

                        <strong>
                          {request.helpType ||
                            "N/A"}
                        </strong>
                      </div>

                      <div className="info-box">
                        <span>
                          📅 Date
                        </span>

                        <strong>
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>
                    </div>

                    <div className="ordered-products-box">
                      <h4>
                        📝 Message
                      </h4>

                      <p>
                        {request.message ||
                          "No message provided."}
                      </p>
                    </div>

                    <div className="order-footer">
                      <div className="order-status-box">
                        <label>
                          Request Status
                        </label>

                        <select
                          value={
                            request.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateRequestStatus(
                              requestId,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            🟡 Pending
                          </option>

                          <option value="In Progress">
                            🔵 In Progress
                          </option>

                          <option value="Completed">
                            🟢 Completed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          CUSTOMER ORDERS
      ===================================================== */}

      <div className="admin-section customer-orders-section">
        <div className="section-heading">
          <div>
            <h2>🛍️ Customer Orders</h2>

            <p>
              Manage and track all customer orders.
            </p>
          </div>

          <div className="orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </div>
        </div>

        {loading ? (
          <p className="empty-message">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="empty-message">
            No customer orders placed yet.
          </p>
        ) : (
          <div className="orders-grid">
            {orders.map((order, idx) => {
              const orderId =
                order._id ||
                order.id ||
                idx;

              const orderedProducts =
                order.products ||
                order.items ||
                [];

              const totalAmount =
                order.total !== undefined
                  ? order.total
                  : order.totalAmount || 0;

              const orderDate =
                order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString()
                  : order.date || "N/A";

              return (
                <div
                  className="customer-order-card"
                  key={orderId}
                >
                  <div className="customer-order-header">
                    <div>
                      <span className="order-label">
                        CUSTOMER
                      </span>

                      <h3>
                        👤 {order.name}
                      </h3>
                    </div>

                    <button
                      className="delete-order-btn"
                      onClick={() =>
                        deleteOrder(
                          orderId
                        )
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <div className="customer-info-grid">
                    <div className="info-box">
                      <span>
                        📧 Email
                      </span>

                      <strong>
                        {order.email ||
                          "N/A"}
                      </strong>
                    </div>

                    <div className="info-box">
                      <span>
                        📱 Phone
                      </span>

                      <strong>
                        {order.phone ||
                          "N/A"}
                      </strong>
                    </div>

                    <div className="info-box">
                      <span>
                        📍 Address
                      </span>

                      <strong>
                        {order.address ||
                          "N/A"}
                      </strong>
                    </div>

                    <div className="info-box">
                      <span>
                        📅 Order Date
                      </span>

                      <strong>
                        {orderDate}
                      </strong>
                    </div>
                  </div>

                  <div className="ordered-products-box">
                    <h4>
                      🛒 Ordered Products
                    </h4>

                    {orderedProducts.length ===
                    0 ? (
                      <p>
                        No products found.
                      </p>
                    ) : (
                      <div className="ordered-products-list">
                        {orderedProducts.map(
                          (item, i) => (
                            <div
                              className="ordered-product-row"
                              key={i}
                            >
                              <div className="product-name">
                                <span className="product-emoji">
                                  {item.icon ||
                                    "📦"}
                                </span>

                                <div>
                                  <strong>
                                    {
                                      item.name
                                    }
                                  </strong>

                                  <small>
                                    Quantity:{" "}
                                    {
                                      item.quantity
                                    }
                                  </small>
                                </div>
                              </div>

                              <strong className="product-price">
                                Rs.{" "}
                                {(
                                  (item.price ||
                                    0) *
                                  (item.quantity ||
                                    0)
                                ).toLocaleString()}
                              </strong>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>
                        Total Amount
                      </span>

                      <strong>
                        Rs.{" "}
                        {Number(
                          totalAmount
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div className="order-status-box">
                      <label>
                        Order Status
                      </label>

                      <select
                        value={
                          order.status ||
                          "Received"
                        }
                        onChange={(e) =>
                          updateOrderStatus(
                            orderId,
                            e.target.value
                          )
                        }
                      >
                        <option value="Received">
                          📥 Received
                        </option>

                        <option value="Processing">
                          🔵 Processing
                        </option>

                        <option value="Shipped">
                          🚚 Shipped
                        </option>

                        <option value="Completed">
                          🟢 Completed
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [cart, setCart] = useState([]);

  /* =======================================================
     INVENTORY FROM BACKEND
  ======================================================= */

  const [inventory, setInventory] = useState({});
  const [inventoryLoading, setInventoryLoading] =
    useState(true);

  const loadInventory = async () => {
    try {
      setInventoryLoading(true);

      const response =
        await axios.get(API + "/inventory");

      const inventoryData =
        Array.isArray(response.data)
          ? response.data
          : [];

      const inventoryObject = {};

      inventoryData.forEach((item) => {
        inventoryObject[item.productId] = {
          added: item.added || 0,
          sold: item.sold || 0,
          remaining: item.remaining || 0,
        };
      });

      setInventory(inventoryObject);
    } catch (error) {
      console.error(
        "Inventory loading error:",
        error
      );

      alert(
        "Inventory could not be loaded."
      );
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct =
        previousCart.find(
          (item) =>
            item.id === product.id
        );

      const availableStock =
        inventory[product.id]
          ?.remaining ?? 0;

      if (
        existingProduct &&
        existingProduct.quantity >=
          availableStock
      ) {
        alert(
          `Only ${availableStock} units of ${product.name} are remaining.`
        );

        return previousCart;
      }

      if (availableStock <= 0) {
        alert(
          `${product.name} is out of stock.`
        );

        return previousCart;
      }

      if (existingProduct) {
        return previousCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const newQuantity =
            item.quantity - 1;

          return newQuantity > 0
            ? {
                ...item,
                quantity:
                  newQuantity,
              }
            : null;
        })
        .filter(Boolean)
    );
  };

  /* =======================================================
     UPDATE CART QUANTITY
  ======================================================= */

  const updateQuantity = (
    id,
    change
  ) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const newQuantity =
            item.quantity + change;

          const availableStock =
            inventory[id]
              ?.remaining ?? 0;

          if (change > 0) {
            if (
              newQuantity >
              availableStock
            ) {
              alert(
                `Only ${availableStock} units are available.`
              );

              return item;
            }
          }

          return newQuantity > 0
            ? {
                ...item,
                quantity:
                  newQuantity,
              }
            : null;
        })
        .filter(Boolean)
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCart([]);
  };

  return (
    <BrowserRouter>
      <Navbar cart={cart} />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/affected-areas"
          element={<AffectedAreas />}
        />

        <Route
          path="/emergency"
          element={<Emergency />}
        />

        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/products"
          element={
            inventoryLoading ? (
              <div className="page">
                <h1>Relief Products 🛒</h1>
                <p>
                  Loading inventory...
                </p>
              </div>
            ) : (
              <Products
                cart={cart}
                addToCart={addToCart}
                removeFromCart={
                  removeFromCart
                }
                updateQuantity={
                  updateQuantity
                }
                clearCart={clearCart}
                inventory={inventory}
                refreshInventory={
                  loadInventory
                }
              />
            )
          }
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminRequests />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;