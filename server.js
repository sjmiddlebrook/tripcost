const { USERNAME, PASSWORD, CLUSTER_NAME, DB_NAME} = require('./mongo-db-constants');
const express = require('express');
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER_NAME}.udbaw.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

let db, trips, expenses;

MongoClient.connect(uri, {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to Database')
  db = client.db('tripcost')
  trips = db.collection('trips')
  expenses = db.collection('expenses')
})

const app = express();
app.use(express.json());


app.post('/trip', (req, res) => {
  const name = req.body.name;
  trips.insertOne({name: name}, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ ok: true });
  })
})

app.get('/trips', (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trips: items })
  })
})

app.post('/expense', (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json({ ok: true });
    }
  )
})

app.get('/expenses', (req, res) => {
  expenses.find({trip: req.body.trip}).toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trips: items })
  })
})

app.listen(3000, () => console.log('Server ready'))
