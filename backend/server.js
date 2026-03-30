const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const SECRET = "tokosepatu_secret_key";

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

const dataDir = path.join(__dirname, "data");
const productsFile = path.join(dataDir, "products.json");
const usersFile = path.join(dataDir, "users.json");
const ordersFile = path.join(dataDir, "orders.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "assets/images/products");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

function readProducts() {
  if (!fs.existsSync(productsFile)) return [];
  return JSON.parse(fs.readFileSync(productsFile, "utf8") || "[]");
}

function writeProducts(data) {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
}

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, "utf8") || "[]");
}

function writeUsers(data) {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

function readOrders() {
  if (!fs.existsSync(ordersFile)) return [];
  return JSON.parse(fs.readFileSync(ordersFile, "utf8") || "[]");
}

function writeOrders(data) {
  fs.writeFileSync(ordersFile, JSON.stringify(data, null, 2));
}

/* ================= NORMALIZER ================= */
function normalizeProduct(data) {
  return {
    ...data,
    price: parseFloat(data.price) || 0,
    stock: parseInt(data.stock) || 0,
    supplierQty: parseInt(data.supplierQty) || 0,
    isActive: data.isActive === "true" || data.isActive === true,
    isPopular: data.isPopular === "true" || data.isPopular === true,
    colors:
      typeof data.colors === "string"
        ? JSON.parse(data.colors || "[]")
        : data.colors || [],
    sizes:
      typeof data.sizes === "string"
        ? data.sizes
        : JSON.stringify(data.sizes || []),
  };
}

/* ================= PRODUCTS ================= */
app.get("/api/products", (req, res) => {
  const products = readProducts().map((p) => {
    let product = { ...p };
    if (product.image && !product.image.startsWith("http"))
      product.image = `http://localhost:${PORT}/` + product.image;
    return product;
  });
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id == req.params.id);
  if (!product)
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  let result = { ...product };
  if (result.image && !result.image.startsWith("http"))
    result.image = `http://localhost:${PORT}/` + result.image;
  res.json(result);
});

app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const products = readProducts();
    let data = normalizeProduct(req.body);

    data.id = Date.now().toString();

    if (req.file) {
      data.image = "assets/images/products/" + req.file.filename;
    }

    products.push(data);
    writeProducts(products);

    res.json({ message: "Produk berhasil ditambahkan", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/products/:id", upload.single("image"), (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex((p) => p.id == req.params.id);

    if (index === -1)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    let updated = normalizeProduct({
      ...products[index],
      ...req.body,
    });

    if (req.file) {
      updated.image = "assets/images/products/" + req.file.filename;
    }

    products[index] = updated;
    writeProducts(products);

    res.json({ message: "Produk berhasil diupdate", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const products = readProducts().filter((p) => p.id != req.params.id);
  writeProducts(products);
  res.json({ message: "Produk berhasil dihapus" });
});

/* ================= ORDERS ================= */
app.get("/api/orders", (req, res) => {
  res.json(readOrders());
});

app.post("/api/orders", (req, res) => {
  try {
    const orders = readOrders();
    const order = req.body;
    orders.push(order);
    writeOrders(orders);
    res.json({ message: "Pesanan berhasil disimpan", data: order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= AUTH ================= */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Data tidak lengkap" });

    let users = readUsers();

    if (users.find((u) => u.email === email))
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hash = await bcrypt.hash(password, 10);

    const user = { id: Date.now(), name, email, password: hash, role: "admin" };
    users.push(user);
    writeUsers(users);

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
