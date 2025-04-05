require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const KEY_VAULT_NAME = process.env.KEY_VAULT_NAME;
const keyVaultUrl = `https://${KEY_VAULT_NAME}.vault.azure.net`;

// Azure Identity for local dev or managed identity
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential);

async function startServer() {
  try {
    // Get Mongo URI from Azure Key Vault
    const mongoUriSecret = await secretClient.getSecret("MONGO_URI");
    const mongoUri = mongoUriSecret.value;

    // Connect to Cosmos DB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to Cosmos DB (MongoDB API)");

    // Register Routes
    const taskRoutes = require("./routes/tasks");
    app.use("/api/tasks", taskRoutes);

    // Serve React frontend in production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../todo-client/build")));
      app.get("*", (req, res) =>
        res.sendFile(path.join(__dirname, "../todo-client/build", "index.html"))
      );
    }

    // Start Server
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
}

startServer();
