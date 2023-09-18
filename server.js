const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002; 

app.use(cors());

const ads = [
  {
    id: 1,
    title: '2-к. квартира, 45,3 м², 2/5 эт.',
    description: 'Описание объявления 1',
    price: 1000,
    images: [ 
      'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',
      'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',
    ],
    address: 'ул. Ленина, д. 10, кв. 5',
    latitude: 45.4343, 
    longitude: 12.3389,
    area: 45.3,
    rooms: 2,
    floor: 2,
    elevator: false,
    balcony: true,
    furniture: true,
    appliances: false,
    type: 'сожитель',
    internet: true,
    img: 'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',

  },  {
    id: 2,
    title: 'Объявление 2',
    description: 'Описание объявления 2',
    price: 1500,
    images: [  
    'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',
  ],
    img: 'https://avatars.mds.yandex.net/i?id=8ed88fcc6da85c2899c9a1c913899d3c_l-5221522-images-thumbs&n=13',
    address: 'пр. Мира, д. 15, кв. 12',
    latitude: 45.4343, 
    longitude: 12.3389,
    area: 60.0,           
    rooms: 3,              
    floor: 3,              
    elevator: true,        
    balcony: false,        
    furniture: false,      
    appliances: true,     
    internet: true,    
    type: 'квартира'    
  },
];


app.get('/ads', (req, res) => {
  res.json(ads);
});

app.get('/ads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ad = ads.find((ad) => ad.id === id);

  if (!ad) {
    return res.status(404).json({ error: 'Advertisement not found' });
  }

  res.json(ad);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get('/landlord', (req, res) => {
  const landlordData = {
    name: 'Иван Иванов',
    photo: 'https://sun9-37.userapi.com/impg/d1HX1olAzlPX8frQjmiRLyqH5DoKgyfeIt05sA/65l7_KhkhZs.jpg?size=853x1280&quality=95&sign=b3256ee4c304b5233ca494358d3e6dfd&type=album',
    contact: '+1234567890',
    telegramUsername: 'kuanpa', 
  };

  res.json(landlordData);
});