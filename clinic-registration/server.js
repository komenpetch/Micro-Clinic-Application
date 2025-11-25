const { PrismaClient } = require("@prisma/client");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
const BROKER_URL = process.env.BROKER_URL
const EXCH_REGISTRATION = process.env.EXCH_REGISTRATION

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  app.use(cors());
}

const prisma = new PrismaClient()

const publisher = require('./publisher')

app.post('/api/registration/new-patient/', async (req, res) => {
  try {
    const patient = await prisma.Patient.create({data: req.body,})
    const channel = await publisher.startPublisher(BROKER_URL)
    publisher.publishMessage(channel, EXCH_REGISTRATION, JSON.stringify(patient))
    res.json(patient)
  }catch(error) {
    res.status(400).json(error);
  }
})

app.get('/api/registration/patient/:pId', async(req, res) => {
  try {
    const patient = await prisma.Patient.findUnique({
      where: {
        id: parseInt(req.params.pId)
      }
    })
    res.json(patient)
  } catch(error) {
    res.status(400).json(error)
  }
})

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
