require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Key Vault setup
const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const credential = new DefaultAzureCredential();
const client = new SecretClient(url, credential);

async function startServer() {
  try {
    // Get Cosmos DB connection string securely from Azure Key Vault
    const mongoSecret = await client.getSecret("MONGO_URI");

    await mongoose.connect(mongoSecret.value, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to Cosmos DB");

    // Routes
    const taskRoutes = require("./routes/tasks");
    app.use("/api/tasks", taskRoutes);

    const path = require("path");

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/build")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
      });
    }

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
}

startServer();
