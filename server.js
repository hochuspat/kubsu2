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

const user = {
  name: 'Лучший студент',
  faculty: 'Лучший факультет',
  course: 'лучший курс',
  photo: null,
};

const buttons = [
  { title: 'Зачетка', screen: 'Зачетка', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=10Ne3GPpapzlhYzHdrpxe-W5UjqJDKBKY' },
  { title: 'Курсы', screen: 'Курсы', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1isizqaFfAJAR__7Uws7WpPx34GqD9aiv' },
  { title: 'Навигатор', screen: 'Навигатор', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1VWw8yc6gNL0n-QWDRWOQVauHJ_SaFCN4' },
  { title: 'Где поесть', screen: 'Где поесть', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=168XV1yanqyvIDs9vwogX3lQ0QAHZO4Ph' },
  { title: 'Жилье', screen: 'Жилье', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1LINelgDDFHwMlKNgHMWW4ICmgehnohXm' },
  { title: 'Инфо', screen: 'Инфо', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1CMZ-i85zlyEEIQ8NQLmDFsWWDCO_O8oy' },
];
const data = [
  {
    id: 1,
    name: 'Студенческий совет',
    description: 'Орган самоуправления студентов, который занимается защитой их прав и интересов, а также организацией различных мероприятий.',
    modalDescription: 'Дополнительное описание для модального окна...',
    image: 'https://kubsu.ru/sites/default/files/news/logotip_novy_profkom.jpg',
    socialLinks: {
      vk: 'https://vk.com/example_vk',
      telegram: 'https://t.me/example_telegram',
  }},
    {
    id: 2,
    name: 'Студенческое научное общество',
    description: 'Объединение студентов, заинтересованных в научной деятельности и участием в конференциях, олимпиадах и проектах.',
    modalDescription: 'Дополнительное описание для модального окна.',
    image: 'https://example.com/rectangular_image2.jpg',
    socialLinks: {
      vk: 'https://vk.com/example_vk',
      telegram: 'https://t.me/example_telegram',
  }},
];
const internships = [
  {
    title: 'Стажер-разработчик в Microsoft',
    description: 'Вы будете работать над развитием и поддержкой платформы Azure, используя современные технологии и методологии. Вы также получите возможность учиться у опытных специалистов и участвовать в различных проектах.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    url: 'https://careers.microsoft.com/us/en/job/1085299/Software-Engineering-Internship'
  },
  {
    title: 'Стажер-дизайнер в Google',
    description: 'Вы будете создавать привлекательные и функциональные интерфейсы для различных продуктов Google, таких как Gmail, YouTube, Google Maps и других. Вы также будете исследовать потребности пользователей и проводить тестирование своих решений.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png',
    url: 'https://careers.google.com/jobs/results/131794517897180397-design-intern-summer-2023/'
  },
  {
    title: 'Стажер-аналитик в Facebook',
    description: 'Вы будете анализировать большие объемы данных, связанных с поведением и взаимодействием пользователей Facebook, Instagram, WhatsApp и других сервисов. Вы также будете предлагать рекомендации по улучшению качества и эффективности этих сервисов.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png',
    url: 'https://www.facebook.com/careers/jobs/2681460348832966/'
  }
];
const schedule1 = [
  {
    id: '1',
    day: 'Понедельник',
    time: '9:00 - 10:30',
    subject: 'Математика',
    teacher: 'Иван Иванович',
    classroom: '101',
  },
  {
    id: '2',
    day: 'Понедельник',
    time: '10:45 - 12:15',
    subject: 'Физика',
    teacher: 'Петр Петрович',
    classroom: '102',
  },
];

const schedule2 = [
  {
    id: '3',
    day: 'Понедельник',
    time: '9:00 - 10:30',
    subject: 'Химия',
    teacher: 'Мария Сергеевна',
    classroom: '201',
  },
  {
    id: '4',
    day: 'Вторник',
    time: '10:45 - 12:15',
    subject: 'Биология',
    teacher: 'Ольга Ивановна',
    classroom: '202',
  },
];

// Коды для расписаний
const shareCode1 = '12345';
const shareCode2 = '54321';

const shareCodeToSchedule = {
  [shareCode1]: schedule1,
  [shareCode2]: schedule2,
};

// Роут для поделиться расписанием
app.get('/share/:shareCode', (req, res) => {
  const { shareCode } = req.params;
  const sharedSchedule = shareCodeToSchedule[shareCode];

  if (sharedSchedule) {
    res.json(sharedSchedule);
  } else {
    res.status(404).json({ error: 'Расписание не найдено' });
  }
});

app.get('/schedule', (req, res) => {
  res.json(schedule1); // Возвращаем расписание 1 по умолчанию
});


const dataa = [
  {
    id: '1',
    category: 'Столовые и буфеты КубГУ',
    name: 'Столовая №1',
    address: 'ул. Большая Садовая, д. 33',
    discount: '10%',
    info: 'Скидка на обеденное меню',
    image: 'https://img-fotki.yandex.ru/get/170627/17778574.1e1/0_c5e1b_ea8bfb18_orig',
  },
  {
    id: '2',
    category: 'Столовые и буфеты КубГУ',
    name: 'Столовая №2',
    address: 'ул. Малая Садовая, д. 15',
    discount: '15%',
    info: 'Скидка на обеды и ужины',
    image: 'https://img-fotki.yandex.ru/get/170627/17778574.1e1/0_c5e1b_ea8bfb18_orig',
  },
];

app.get('/dataa', (req, res) => {
  res.json(dataa);
});
const internships1 = [
  {
    title: 'Стажер-разработчик в Microsoft',
    description: 'Вы будете работать над развитием и поддержкой платформы Azure, используя современные технологии и методологии. Вы также получите возможность учиться у опытных специалистов и участвовать в различных проектах.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    url: 'https://careers.microsoft.com/us/en/job/1085299/Software-Engineering-Internship'
  },
];

app.get('/internships1', (req, res) => {
  res.json(internships1);
});

app.get('/internships', (req, res) => {
  res.json(internships);
});
app.get('/organizations', (req, res) => {
  res.json(data);
});
app.get('/user', (req, res) => {
  res.json(user);
});

app.get('/buttons', (req, res) => {
  res.json(buttons);
});

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