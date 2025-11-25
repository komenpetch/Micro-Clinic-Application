const { PrismaClient } = require("@prisma/client");
const express = require('express');
const bodyParser = require('body-parser');
const publisher = require('./publisher')
const app = express();
const PORT = process.env.PORT;
const BROKER_URL = process.env.BROKER_URL
const EXCH_REGISTRATION = process.env.EXCH_REGISTRATION
const EXCH_EXAMINED = process.env.EXCH_EXAMINED

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  app.use(cors());
}

const prisma = new PrismaClient()

const consumer = require('./consumer')
consumer.initConnection(BROKER_URL, (conn) => {
  consumer.startConsumer(conn, EXCH_REGISTRATION,
    async (content, callback) => {
      console.log(`New patient arrive saving to database. ${content}`)
      // Parse data only get the interesting fields
      const PATIENT_FIELDS = ['id', 'name']
      const newPatient = JSON.parse(content)
      const pData = Object.keys(newPatient)
      .filter(key => PATIENT_FIELDS.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: newPatient[key] }), {})

      // Commit to database
      await prisma.Patient.create({ data: pData, })
      callback(true);
  })
})

app.get('/api/examination/list/', async (req, res) => {
  try {
    const patients = await prisma.Patient.findMany({
      orderBy: {
        created: 'desc'
      },
      include: {
        diagnosis: true,
      }
    })
    res.json(patients)
  } catch (error) {
    res.status(400).json(error);
  }
})

app.post('/api/examination/diagnosis/', async(req, res) => {
  try {
    const diag = await prisma.Diagnosis.create({ 
      data: req.body,
      include: {  // Include patient detail after created
        patient: true,
      }
    })
    const channel = await publisher.startPublisher(BROKER_URL)
    publisher.publishMessage(channel, EXCH_EXAMINED, JSON.stringify(diag))
    res.json(diag)
  } catch (error) {
    res.status(400).json(error);
  }
})

app.get('/api/examination/diagnosis/:pId', async(req, res) => {
  try {
    const diag = await prisma.Diagnosis.findUnique({
      where: {
        patient_id: parseInt(req.params.pId)
      }
    })
    res.json(diag)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
