const express = require('express')
const app = express()
const cors = require("cors")

const mongoose = require('mongoose');
const port = process.env.PORT || 5000
require('dotenv').config()

// --- CSP Middleware ---
// Add this section after your other global middleware like express.json() and cors()
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    // Adjust these directives based on your specific needs
    // 'self' allows resources from your own domain
    // 'data:' specifically allows data URIs (like base64 encoded images)
    // 'unsafe-inline' for style-src might be needed if you have inline <style> tags or styles injected by libraries
    // 'unsafe-eval' for script-src should be avoided if possible, use only if absolutely necessary for specific libraries
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'"
  );
  next(); // Essential to pass control to the next middleware/route handler
});
// --- End CSP Middleware ---

//middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-two-smoky.vercel.app'],
    credentials: true
}))

//routes 
const bookRoutes = require('./src/books/book.route')
const orderRoutes = require('./src/orders/order.route')
const userRoutes = require('./src/users/user.route')
const adminRoutes = require('./src/stats/admin.stats')

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use('/', (req, res) => {
    res.send('Book Store Server is running')
  });
}

main().then(() => console.log("Mongodb connected Successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})