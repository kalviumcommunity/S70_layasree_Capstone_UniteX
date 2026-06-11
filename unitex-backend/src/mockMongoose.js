const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "../mock_db.json");

// Initialize empty DB file if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({ users: [], events: [], bookings: [], messages: [] }, null, 2)
  );
}

function readData() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], events: [], bookings: [], messages: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("mockMongoose writeData error:", err.message);
  }
}

function genId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// ─── Query (chainable wrapper) ────────────────────────────────────────────────
class Query {
  constructor(data, collectionName) {
    this.data = data;
    this.collectionName = collectionName;
  }

  populate(pathName) {
    if (this.data) {
      const db = readData();
      const docs = Array.isArray(this.data) ? this.data : [this.data];
      docs.forEach((doc) => {
        if (!doc) return;
        if (pathName === "organizer" && doc.organizer && typeof doc.organizer === "string") {
          const found = db.users.find((u) => u._id === doc.organizer);
          if (found) doc.organizer = { _id: found._id, username: found.username, email: found.email, role: found.role };
        }
        if (pathName === "rsvps" && Array.isArray(doc.rsvps)) {
          doc.rsvps = doc.rsvps.map((uid) => {
            if (typeof uid !== "string") return uid;
            const found = db.users.find((u) => u._id === uid);
            return found ? { _id: found._id, username: found.username, email: found.email } : uid;
          });
        }
      });
    }
    return this;
  }

  select() { return this; }

  sort() {
    if (Array.isArray(this.data)) {
      this.data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return this;
  }

  limit(n) {
    if (Array.isArray(this.data)) this.data = this.data.slice(0, n);
    return this;
  }

  // Makes `await query` work
  then(resolve, reject) {
    return Promise.resolve(this.data).then(resolve, reject);
  }
}

// ─── createModel factory ───────────────────────────────────────────────────────
function createModel(collectionName) {
  // Document class — supports `new Model(data)` + `.save()`
  class Document {
    constructor(data = {}) {
      Object.assign(this, data);
      if (!this.rsvps) this.rsvps = [];
    }

    async save() {
      const db = readData();
      const col = db[collectionName];
      if (!this._id) {
        this._id = genId();
        this.createdAt = new Date().toISOString();
      }
      this.updatedAt = new Date().toISOString();

      // Strip non-serialisable stuff before writing
      const plain = JSON.parse(JSON.stringify(this));

      const idx = col.findIndex((x) => x._id === this._id);
      if (idx > -1) col[idx] = plain;
      else col.push(plain);
      writeData(db);
      return this;
    }
  }

  // ── Static helpers ────────────────────────────────────────────────────────
  Document.create = async function (data) {
    const doc = new Document(data);
    await doc.save();
    return doc;
  };

  Document.find = function (filter = {}) {
    const db = readData();
    let results = [...db[collectionName]];

    Object.entries(filter).forEach(([key, val]) => {
      if (key === "$or") {
        results = results.filter((doc) =>
          val.some((cond) => {
            const [k, v] = Object.entries(cond)[0];
            if (v && v.$regex) return doc[k] && doc[k].toLowerCase().includes(v.$regex.toLowerCase());
            return doc[k] === v;
          })
        );
      } else if (val && typeof val === "object" && val.$regex) {
        results = results.filter((doc) => doc[key] && doc[key].toLowerCase().includes(val.$regex.toLowerCase()));
      } else if (val && typeof val === "object" && val.$gte) {
        results = results.filter((doc) => new Date(doc[key]) >= new Date(val.$gte));
      } else if (key === "organizer") {
        results = results.filter((doc) => doc.organizer && doc.organizer.toString() === val.toString());
      } else {
        results = results.filter((doc) => doc[key] === val);
      }
    });

    const docs = results.map((r) => new Document(r));
    return new Query(docs, collectionName);
  };

  Document.findOne = function (filter = {}) {
    const db = readData();
    let results = [...db[collectionName]];
    Object.entries(filter).forEach(([key, val]) => {
      results = results.filter((doc) => doc[key] === val);
    });
    if (!results.length) return new Query(null, collectionName);
    return new Query(new Document(results[0]), collectionName);
  };

  Document.findById = function (id) {
    const db = readData();
    const found = db[collectionName].find((doc) => doc._id === id);
    if (!found) return new Query(null, collectionName);
    return new Query(new Document(found), collectionName);
  };

  Document.findByIdAndUpdate = async function (id, update, opts = {}) {
    const db = readData();
    const col = db[collectionName];
    const idx = col.findIndex((doc) => doc._id === id);
    if (idx === -1) return null;
    col[idx] = { ...col[idx], ...update, updatedAt: new Date().toISOString() };
    writeData(db);
    return col[idx];
  };

  Document.findByIdAndDelete = async function (id) {
    const db = readData();
    const col = db[collectionName];
    const idx = col.findIndex((doc) => doc._id === id);
    if (idx === -1) return null;
    const [removed] = col.splice(idx, 1);
    writeData(db);
    return removed;
  };

  Document.deleteMany = async function (filter = {}) {
    const db = readData();
    const col = db[collectionName];
    if (filter.organizer || filter.user) {
      const targetId = (filter.organizer || filter.user).toString();
      db[collectionName] = col.filter((doc) => {
        const oid = (doc.organizer || doc.user || "").toString();
        return oid !== targetId;
      });
    } else {
      db[collectionName] = [];
    }
    writeData(db);
    return { deletedCount: 1 };
  };

  Document.select = () => Document; // noop for chaining

  return Document;
}

module.exports = {
  User:    createModel("users"),
  Event:   createModel("events"),
  Booking: createModel("bookings"),
  Message: createModel("messages"),
};
