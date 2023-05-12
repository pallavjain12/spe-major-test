const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors,images } = require('./seedHelpers');
const Chainagri = require('../models/chainagri');

mongoose.connect('mongodb://localhost:27017/chai-nagri', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Chainagri.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const stalls = new Chainagri({
            author: '6448267ac2873dcb2c46c8a9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dbdcsgrp9/image/upload/v1682497026/ChaiNagri/w38jne0ojkvalnvj7buh.jpg',
                  filename: 'ChaiNagri/w38jne0ojkvalnvj7buh',
                },
                {
                  url: 'https://res.cloudinary.com/dbdcsgrp9/image/upload/v1682497026/ChaiNagri/wt159aqcho3vakiif5xv.jpg',
                  filename: 'ChaiNagri/wt159aqcho3vakiif5xv',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ] 
            },
        })
        await stalls.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})