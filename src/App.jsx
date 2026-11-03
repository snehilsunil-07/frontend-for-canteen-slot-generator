import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coffee,
  CreditCard,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  TicketCheck,
  UtensilsCrossed,
  X,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Neer dosa & chicken sukka",
    description: "Soft rice crepes with Mangalorean dry chicken",
    price: 150,
    category: "Meals",
    tag: "Coastal favourite",
    image: "photo-1630383249896-424e482df921",
    color: "#f4ebdc",
    vegetarian: false,
  },
  {
    id: 2,
    name: "Kori rotti & chicken gassi",
    description: "Crisp rice wafers with coconut-rich chicken curry",
    price: 160,
    category: "Meals",
    tag: "Mangalorean classic",
    image: "photo-1603894584373-5ac82b2ae398",
    color: "#f4ebdc",
    vegetarian: false,
  },
  {
    id: 3,
    name: "Neer dosa & veg saagu",
    description: "Delicate rice crepes with gently spiced veg curry",
    price: 75,
    category: "Vegetarian",
    tag: "Vegetarian",
    image: "photo-1630383249896-424e482df921",
    color: "#e9f0e2",
    vegetarian: true,
  },
  {
    id: 4,
    name: "Mangalore buns",
    description: "Sweet, fluffy banana puris with coconut chutney",
    price: 45,
    category: "Snacks",
    tag: "Tea-time pick",
    image: "photo-1601050690597-df0568f70950",
    color: "#f4ebdc",
    vegetarian: true,
  },
  {
    id: 5,
    name: "Goli baje",
    description: "Golden Mangalorean fritters with coconut chutney",
    price: 40,
    category: "Snacks",
    tag: "Local favourite",
    image: "photo-1601050690117-94f5f6fa8bd7",
    color: "#f3e8dc",
    vegetarian: true,
  },
  {
    id: 6,
    name: "Mangalore masala dosa",
    description: "Crispy dosa, potato palya, chutney and sambar",
    price: 80,
    category: "Meals",
    tag: "Canteen classic",
    image: "photo-1630383249896-424e482df921",
    color: "#f4ecdf",
    vegetarian: true,
  },
  {
    id: 7,
    name: "Filter kaapi",
    description: "Strong South Indian coffee, served hot",
    price: 25,
    category: "Drinks",
    tag: "Campus pick-me-up",
    image: "photo-1517701604599-bb29b565090c",
    color: "#eee8e0",
    vegetarian: true,
  },
  {
    id: 8,
    name: "Fresh lime soda",
    description: "Fresh lime, soda and a pinch of black salt",
    price: 35,
    category: "Drinks",
    tag: "Made to order",
    image: "photo-1513558161293-cdaf765edfd7",
    color: "#e7eee1",
    vegetarian: true,
  },
];

const categories = [
  { name: "Everything", icon: UtensilsCrossed },
  { name: "Meals", icon: Flame },
  { name: "Snacks", icon: Sparkles },
  { name: "Drinks", icon: Coffee },
  { name: "Vegetarian", icon: Leaf },
];

const pickupSlots = [
  { time: "12:15 – 12:30", spots: 4 },
  { time: "12:30 – 12:45", spots: 8 },
  { time: "12:45 – 1:00", spots: 6 },
  { time: "1:00 – 1:15", spots: 0 },
];

const rupees = (amount) => `₹${amount}`;

function ProductCard({ item, quantity, onAdd }) {
  return (
    <article className="product-card group">
      <div className="product-image-wrap" style={{ backgroundColor: item.color }}>
        <img
          src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=720&q=85`}
          alt={item.name}
          className="product-image"
          loading="lazy"
        />
        {item.tag && <span className="product-tag">{item.tag}</span>}
        <span
          className={`diet-mark ${item.vegetarian ? "veg-mark" : "non-veg-mark"}`}
          aria-label={item.vegetarian ? "Vegetarian" : "Non-vegetarian"}
          title={item.vegetarian ? "Vegetarian" : "Contains chicken"}
        >
          <span />
        </span>
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <h3>{item.name}</h3>
          <span className="product-price">{rupees(item.price)}</span>
        </div>
        <p>{item.description}</p>
        <button className={`add-button ${quantity ? "added" : ""}`} onClick={onAdd}>
          {quantity ? (
            <>
              <Check size={15} strokeWidth={2.5} />
              Added · {quantity}
            </>
          ) : (
            <>
              Add to order <Plus size={15} strokeWidth={2.4} />
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function Modal({ children, onClose, className = "" }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className={`modal-card ${className}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={19} />
        </button>
        {children}
      </section>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [pickupSlot, setPickupSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Google Pay");
  const [modal, setModal] = useState("");
  const [order, setOrder] = useState(null);
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const inCategory = activeCategory === "Everything" || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return inCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const cartItems = menuItems.filter((item) => cart[item.id]);
  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * cart[item.id], 0);
  const serviceFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + serviceFee;

  const updateQuantity = (id, change) => {
    setCart((current) => {
      const nextQuantity = (current[id] || 0) + change;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  };

  const completeOrder = () => {
    const token = `GC-${String(Date.now()).slice(-6)}`;
    setOrder({ token, slot: pickupSlot, items: cartItems, cart: { ...cart }, total });
    setCart({});
    setPickupSlot("");
    setModal("success");
  };

  const openOrders = () => {
    setModal(order ? "success" : "orders");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Gather home">
          <span className="brand-mark"><span /></span>
          <span>gather<span className="brand-period">.</span></span>
        </a>

        <div className="campus-label">YOUR CAMPUS</div>
        <button className="campus-select">
          <span className="campus-avatar">S</span>
          <span className="campus-copy"><strong>Sahyadri College</strong><small>Mangaluru, Karnataka</small></span>
          <ChevronDown size={15} />
        </button>

        <div className="sidebar-label">MENU</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <UtensilsCrossed size={18} /> Order food
          </button>
          <button className="nav-item" onClick={openOrders}>
            <TicketCheck size={18} /> My orders
            {order && <span className="nav-dot" />}
          </button>
          <button
            className={`nav-item ${activeCategory === "Vegetarian" ? "active" : ""}`}
            onClick={() => {
              setActiveCategory("Vegetarian");
              document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Heart size={18} /> Vegetarian picks
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="perk-card">
            <span className="perk-icon"><Sparkles size={16} /></span>
            <strong>Good food, good mood.</strong>
            <p>Every 5th order comes with a little treat on us.</p>
            <div className="perk-progress"><span /></div>
            <small>2 of 5 orders to your treat</small>
          </div>
          <button className="profile-button">
            <span className="profile-avatar">S</span>
            <span className="profile-copy"><strong>Campus student</strong><small>Sahyadri College</small></span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark"><span /></span>
            <span>gather<span className="brand-period">.</span></span>
          </div>
          <div className="breadcrumb"><span>Sahyadri College</span><span className="crumb-slash">/</span><strong>Canteen</strong></div>
          <div className="topbar-right">
            <span className="open-status"><i /> Open until 5:30 pm</span>
            <button className="mobile-orders" onClick={openOrders} aria-label="My orders"><TicketCheck size={19} /></button>
            <button className="top-avatar" aria-label="Student profile">S</button>
          </div>
        </header>

        <div className="content-grid">
          <section className="menu-column">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">SAHYADRI COLLEGE OF ENGINEERING &amp; MANAGEMENT</p>
                <h1>What sounds good? <span>Pick a campus favourite.</span></h1>
                <p className="welcome-subtitle">Coastal Karnataka favourites, made fresh on campus.</p>
              </div>
              <div className="weather-pill"><MapPin size={14} /> Mangaluru, Karnataka</div>
            </div>

            <section className="hero-banner">
              <div className="hero-copy">
                <span className="hero-kicker"><Sparkles size={13} /> A TASTE OF COASTAL KARNATAKA</span>
                <h2>A taste of Mangaluru.<br /><span>One bite at a time.</span></h2>
                <p>Neer dosa, goli baje and more. Order ahead and skip the queue.</p>
                <button className="hero-button" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
                  Find your lunch <ArrowDown size={15} />
                </button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="hero-orbit orbit-one" />
                <div className="hero-orbit orbit-two" />
                <div className="hero-food">🍛</div>
                <span className="hero-sparkle sparkle-one">✳</span>
                <span className="hero-sparkle sparkle-two">✦</span>
                <span className="hero-sparkle sparkle-three">✳</span>
              </div>
              <div className="hero-note"><Clock3 size={14} /> Ready when you are</div>
            </section>

            <section className="quick-info">
              <div className="quick-info-item">
                <span className="quick-icon"><Clock3 size={17} /></span>
                <div><strong>15–20 min</strong><small>Average prep time</small></div>
              </div>
              <span className="quick-divider" />
              <div className="quick-info-item">
                <span className="quick-icon green"><Leaf size={17} /></span>
                <div><strong>Made fresh</strong><small>Right here on campus</small></div>
              </div>
              <span className="quick-divider" />
              <div className="quick-info-item">
                <span className="quick-icon yellow"><TicketCheck size={17} /></span>
                <div><strong>Zero queue</strong><small>Grab and get going</small></div>
              </div>
            </section>

            <section className="menu-section" id="menu">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MADE WITH A LITTLE EXTRA LOVE</p>
                  <h2>Today’s menu <span className="menu-count">{filteredItems.length} items</span></h2>
                </div>
                <label className="search-box">
                  <Search size={17} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find something..." />
                  {search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={15} /></button>}
                </label>
              </div>

              <div className="category-list" role="tablist" aria-label="Menu categories">
                {categories.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    className={`category-button ${activeCategory === name ? "selected" : ""}`}
                    onClick={() => setActiveCategory(name)}
                    role="tab"
                    aria-selected={activeCategory === name}
                  >
                    <Icon size={15} /> {name}
                  </button>
                ))}
              </div>

              {filteredItems.length ? (
                <div className="product-grid">
                  {filteredItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onAdd={() => updateQuantity(item.id, 1)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-menu">
                  <span>🥣</span>
                  <strong>No bites found</strong>
                  <p>Try another search or category.</p>
                  <button onClick={() => { setSearch(""); setActiveCategory("Everything"); }}>Show everything</button>
                </div>
              )}
            </section>
            <footer className="page-footer"><span>Made for campus, with <span className="footer-heart">♥</span></span><span>Have an allergy? Ask our team before ordering.</span></footer>
          </section>

          <aside className="order-column" aria-label="Your order">
            <div className="order-panel">
              <div className="order-heading">
                <div><p className="eyebrow">YOUR LITTLE LINE-UP</p><h2>Your order <span>{itemCount}</span></h2></div>
                <span className="bag-icon"><ShoppingBag size={18} /></span>
              </div>

              {cartItems.length ? (
                <div className="cart-list">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=120&q=75`} alt="" />
                      <div className="cart-item-copy">
                        <strong>{item.name}</strong>
                        <span>{rupees(item.price)} each</span>
                      </div>
                      <div className="quantity-control">
                        <button aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}><Minus size={13} /></button>
                        <span>{cart[item.id]}</span>
                        <button aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}><Plus size={13} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="browse-more" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
                    Add something else <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="empty-cart">
                  <div className="empty-cart-illustration"><ShoppingBag size={24} /></div>
                  <strong>Your order is looking a little empty</strong>
                  <p>Pick a campus favourite and it’ll show up here.</p>
                  <button onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>Explore the menu <ArrowDown size={14} /></button>
                </div>
              )}

              <div className="panel-rule" />
              <div className="slot-heading">
                <div><p className="eyebrow">PLAN YOUR PICKUP</p><h3>Choose a time slot</h3></div>
                <span className="today-label">TODAY</span>
              </div>
              <div className="slot-list">
                {pickupSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={slot.spots === 0}
                    className={`slot-option ${pickupSlot === slot.time ? "chosen" : ""}`}
                    onClick={() => setPickupSlot(slot.time)}
                  >
                    <span className="slot-radio">{pickupSlot === slot.time && <span />}</span>
                    <span className="slot-time">{slot.time}</span>
                    <span className={`slot-spots ${slot.spots < 5 && slot.spots > 0 ? "few-spots" : ""}`}>
                      {slot.spots === 0 ? "Full" : `${slot.spots} spots`}
                    </span>
                  </button>
                ))}
              </div>
              {!pickupSlot && itemCount > 0 && <p className="slot-hint">Pick a slot to continue</p>}

              <div className="panel-rule totals-rule" />
              <div className="price-row"><span>Subtotal</span><span>{rupees(subtotal)}</span></div>
              <div className="price-row service-row"><span>Campus service fee</span><span>{rupees(serviceFee)}</span></div>
              <div className="price-row total-row"><strong>Total</strong><strong>{rupees(total)}</strong></div>
              <button
                className="checkout-button"
                disabled={!itemCount || !pickupSlot}
                onClick={() => setModal("payment")}
              >
                <span><CreditCard size={16} /> Pay with UPI</span>
                <span>{rupees(total)} <ArrowUpRight size={16} /></span>
              </button>
              <div className="secure-note"><CheckCircle2 size={13} /> Secure UPI checkout <span>·</span> No cash, no queue</div>
              <p className="demo-note">Demo checkout only — no real payment will be taken.</p>
            </div>
            <div className="help-note"><span>Need a hand?</span> <button onClick={() => setModal("help")}>We’re right here <ArrowUpRight size={13} /></button></div>
          </aside>
        </div>
      </main>

      {modal === "payment" && (
        <Modal onClose={() => setModal("")}>
          <div className="modal-eyebrow"><CreditCard size={14} /> QUICK & SECURE CHECKOUT</div>
          <h2>Pay with UPI<span>.</span></h2>
          <p className="modal-description">Choose your preferred UPI app for this demo order.</p>
          <div className="payment-methods">
            {["Google Pay", "PhonePe", "Paytm"].map((method, index) => (
              <button key={method} className={`payment-method ${paymentMethod === method ? "picked" : ""}`} onClick={() => setPaymentMethod(method)}>
                <span className={`payment-logo logo-${index}`}>{["G", "पे", "P"][index]}</span>
                <strong>{method}</strong>
                <span className="payment-check">{paymentMethod === method && <Check size={12} />}</span>
              </button>
            ))}
          </div>
          <div className="payment-breakdown">
            <span>Pickup at {pickupSlot}</span><strong>{rupees(total)}</strong>
          </div>
          <div className="demo-warning"><Sparkles size={15} /> This is a prototype. Tapping below simulates a successful payment.</div>
          <button className="modal-primary" onClick={completeOrder}>Pay {rupees(total)} <ArrowRight size={16} /></button>
          <p className="modal-footnote">No money will be charged. Real UPI payments need a payment provider integration.</p>
        </Modal>
      )}

      {modal === "success" && order && (
        <Modal onClose={() => setModal("")} className="success-modal">
          <div className="success-icon"><Check size={27} strokeWidth={2.4} /></div>
          <p className="modal-eyebrow centered">YOU’RE ALL SET</p>
          <h2>Order’s in<span>.</span></h2>
          <p className="modal-description centered">Your food will be ready for pickup. Show this token at the canteen counter.</p>
          <div className="token-ticket">
            <div className="token-label"><TicketCheck size={15} /> YOUR PICKUP TOKEN</div>
            <div className="token-number">{order.token}</div>
            <div className="token-details"><span><Clock3 size={14} /> Today, {order.slot}</span><span>{rupees(order.total)} paid · demo</span></div>
          </div>
          <div className="pickup-reminder"><span>📍</span><p><strong>Where to go</strong><br />Sahyadri College canteen · Pre-order counter</p></div>
          <button className="modal-primary" onClick={() => setModal("")}>Back to menu <ArrowRight size={16} /></button>
        </Modal>
      )}

      {modal === "orders" && (
        <Modal onClose={() => setModal("")}>
          <div className="modal-eyebrow"><TicketCheck size={14} /> ORDER HISTORY</div>
          <h2>Your orders<span>.</span></h2>
          <div className="orders-empty"><span>🍽️</span><strong>No orders just yet</strong><p>Your next delicious lunch is only a few taps away.</p></div>
          <button className="modal-primary" onClick={() => setModal("")}>Browse the menu <ArrowRight size={16} /></button>
        </Modal>
      )}

      {modal === "help" && (
        <Modal onClose={() => setModal("")}>
          <div className="modal-eyebrow"><Heart size={14} /> WE’RE HERE FOR YOU</div>
          <h2>Need a hand<span>?</span></h2>
          <p className="modal-description">For allergies, ingredients, or a hand with your order, just ask the team at the canteen counter before you pay.</p>
          <div className="help-card"><span>📍</span><div><strong>Sahyadri College canteen</strong><small>Mangaluru, Karnataka · Open today until 5:30 pm</small></div></div>
          <button className="modal-primary" onClick={() => setModal("")}>Got it <Check size={16} /></button>
        </Modal>
      )}
    </div>
  );
}
