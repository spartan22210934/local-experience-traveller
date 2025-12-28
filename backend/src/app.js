import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import exploreRoutes from './routes/explore.route.js';

const app = express();

// In app.js
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/explore", exploreRoutes);

export default app;
