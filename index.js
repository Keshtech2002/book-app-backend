const express = require('express')
const app = express()
const cors = require("cors")
const helmet = require('helmet');

const mongoose = require('mongoose');
const port = process.env.PORT || 5000
require('dotenv').config()

//middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-two-smoky.vercel.app'],
    credentials: true
}))

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://book-app-backend-pied.vercel.app"],
      imgSrc: ["'self'", "data:"],  // ✅ Allow base64 images
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

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