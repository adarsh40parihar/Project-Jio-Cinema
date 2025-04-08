const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config(); 

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev")); //logger for debugging
}

// allowing frontend to access the api
const cors = require("cors");
const corsConfig = {
  origin: "http://localhost:3000",// Replace with your frontend's origin
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const AuthRouter = require("./Router/AuthRouter");  
const UserRouter = require("./Router/UserRouter");
const MoviesRouter = require("./Router/MoviesRouter");
const DiscoverRouter = require("./Router/DiscoverRouter");
const TvShowsRouter = require("./Router/TvRouter");
const PaymentRouter = require("./Router/PaymentRouter");
const VideoRouter = require("./Router/VideoRouter");

app.use("/api/auth/", AuthRouter); //✅
app.use("/api/user", UserRouter);  //✅
app.use("/api/movies", MoviesRouter); //✅
app.use("/api/discover", DiscoverRouter);//✅
app.use("/api/tv", TvShowsRouter);//✅
app.use("/api/payment", PaymentRouter);//✅
app.use("/api/videos", VideoRouter);  // ❌ not verified yet

// Conditional DB connection and server startup
async function startServer() {
  // Only connect to DB in development mode
  if (process.env.NODE_ENV !== 'test') {
    /***********************************Connection*********************************/
    const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xpchg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    console.log("Connection to server");
    mongoose
      .connect(dbLink)
      .then(function (connection) {
        console.log("Connected to the database successfully.");
      })
      .catch((err) => console.log("Error connecting to the database:", err));
  }
  const PORT = process.env.NODE_ENV === 'test' ? 5000 : process.env.PORT;
  
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Start server if not being required by another module (like tests)
if (process.env.NODE_ENV != 'test') {
    startServer();
}

// Export for testing
module.exports = { app };
