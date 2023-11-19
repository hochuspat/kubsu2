const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const ActiveDirectory = require('activedirectory');

const app = express();

// Middleware для обработки тела запроса в формате JSON
app.use(express.json());
// Настройка Multer для обработки загружаемых файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Добавляем заголовки CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'mydatabase',
});

// Настройка папки с загруженными файлами
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Роут для админ-панели
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
});
// Получение всех новостей
// Получение всех новостей или новостей по категории
app.get('/news', (req, res) => {
  const { category } = req.query;

  let selectQuery = 'SELECT * FROM news';
  let queryParams = [];

  if (category) {
    selectQuery = 'SELECT * FROM news WHERE category = ?';
    queryParams = [category];
  }

  connection.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Ошибка при получении новостей:', err);
      res.status(500).json({ error: 'Ошибка при получении новостей' });
    } else {
      res.json(results);
    }
  });
});

// Получение конкретной новости
app.get('/news/:id', (req, res) => {
  const { id } = req.params;
  const selectQuery = 'SELECT * FROM news WHERE id = ?';

  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error('Ошибка при получении новости:', err);
      res.status(500).json({ error: 'Ошибка при получении новости' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Новость не найдена' });
    } else {
      res.json(results[0]);
    }
  });
});

// Добавление новости
app.post('/news', upload.single('image'), (req, res) => {
  const { title, category, content, date, faculty } = req.body;
  const image = req.file ? req.file.filename : null;
  const insertQuery = 'INSERT INTO news (title, category, content, date, image, faculty) VALUES (?, ?, ?, ?, ?,?)';

  connection.query(insertQuery, [title, category, content, date, image, faculty], (err, results) => {
    if (err) {
      console.error('Ошибка при добавлении новости:', err);
      res.status(500).json({ error: 'Ошибка при добавлении новости' });
    } else {
      res.json({ message: 'Новость успешно добавлена', id: results.insertId });
    }
  });
});

// Редактирование новости
app.put('/news/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, category, content, date, faculty } = req.body;
  const image = req.file ? req.file.filename : null;
  const updateQuery = 'UPDATE news SET title = ?, category = ?, content = ?, date = ?, image = ?,faculty=? WHERE id = ?';

  connection.query(updateQuery, [title, category, content, date, image,faculty, id], (err, results) => {
    if (err) {
      console.error('Ошибка при обновлении новости:', err);
      res.status(500).json({ error: 'Ошибка при обновлении новости' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Новость не найдена' });
    } else {
      res.json({ message: 'Новость успешно обновлена', id: id });
    }
  });
});

// Удаление новости
app.delete('/news/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM news WHERE id = ?';

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Ошибка при удалении новости:', err);
      res.status(500).json({ error: 'Ошибка при удалении новости' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Новость не найдена' });
    } else {
      res.json({ message: 'Новость успешно удалена', id: id });
    }
  });
});
// Маршрут для получения данных из таблицы ads
app.get('/ads', (req, res) => {
  const sql = 'SELECT * FROM ads';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});
// Маршрут для редактирования данных в таблице ads
app.put('/ads/:id', (req, res) => {
  const adId = req.params.id;
  const {
    title,
    description,
    price,
    address,
    latitude,
    longitude,
    area,
    rooms,
    floor,
    elevator,
    balcony,
    furniture,
    appliances,
    type,
    internet,
    img
  } = req.body;

  // Выполняем SQL-запрос для обновления данных
  const sql =
    'UPDATE ads SET title=?, description=?, price=?, address=?, latitude=?, longitude=?, area=?, rooms=?, floor=?, elevator=?, balcony=?, furniture=?, appliances=?, type=?, internet=?, img=? WHERE id=?';
  connection.query(
    sql,
    [
      title,
      description,
      price,
      address,
      latitude,
      longitude,
      area,
      rooms,
      floor,
      elevator,
      balcony,
      furniture,
      appliances,
      type,
      internet,
      img,
      adId
    ],
    (err, result) => {
      if (err) {
        console.error('Ошибка выполнения SQL-запроса:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
      } else {
        res.json({ message: 'Данные успешно обновлены' });
      }
    }
  );
});
app.post('/ads', (req, res) => {
  // Проверка наличия всех обязательных полей в запросе
  const requiredFields = [
    'title',
    'description',
    'price',
    'address',
    'latitude',
    'longitude',
    'area',
    'rooms',
    'floor',
    'elevator',
    'balcony',
    'furniture',
    'appliances',
    'type',
    'internet',
    'img'
  ];
console.log('POST запрос на сервер с данными:', req.body); 
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      res.status(400).json({ error: `Отсутствует обязательное поле: ${field}` });
      return;
    }
  }

  // Если все обязательные поля присутствуют, продолжаем выполнение кода
  const {
    title,
    description,
    price,
    address,
    latitude,
    longitude,
    area,
    rooms,
    floor,
    elevator,
    balcony,
    furniture,
    appliances,
    type,
    internet,
    img
  } = req.body; 

  // Выполняем SQL-запрос для вставки данных
  const sql =
    'INSERT INTO ads (title, description, price, address, latitude, longitude, area, rooms, floor, elevator, balcony, furniture, appliances, type, internet, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
connection.query(
  sql,
  [
    title,
    description,
    price,
    address,
    latitude,
    longitude,
    area,
    rooms,
    floor,
    elevator,
    balcony,
    furniture,
    appliances,
    type,
    internet,
    img
  ],
  (err, result) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      console.log('Данные успешно добавлены в базу данных');
      res.json({ message: 'Данные успешно добавлены', id: result.insertId });
    }
  }
);
});

// Маршрут для получения данных из таблицы dataa
app.get('/dataa', (req, res) => {
  const sql = 'SELECT * FROM dataa';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы internships
app.get('/internships', (req, res) => {
  const sql = 'SELECT * FROM internships';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы расписания
app.get('/schedule', (req, res) => {
  const sql = 'SELECT * FROM schedule';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});
app.post('/schedule', (req, res) => {
  const { day, time, subject, teacher, classroom } = req.body;
  const insertQuery = 'INSERT INTO schedule (day, time, subject, teacher, classroom) VALUES (?, ?, ?, ?, ?)';

  connection.query(insertQuery, [day, time, subject, teacher, classroom], (err, results) => {
    if (err) {
      console.error('Ошибка при добавлении урока:', err);
      res.status(500).json({ error: 'Ошибка при добавлении урока' });
    } else {
      res.json({ message: 'Урок успешно добавлен', id: results.insertId });
    }
  });
});
app.put('/schedule/:id', (req, res) => {
  const { id } = req.params;
  const { day, time, subject, teacher, classroom } = req.body;
  const updateQuery = 'UPDATE schedule SET day = ?, time = ?, subject = ?, teacher = ?, classroom = ? WHERE id = ?';

  connection.query(updateQuery, [day, time, subject, teacher, classroom, id], (err, results) => {
    if (err) {
      console.error('Ошибка при обновлении урока:', err);
      res.status(500).json({ error: 'Ошибка при обновлении урока' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Урок не найден' });
    } else {
      res.json({ message: 'Урок успешно обновлен', id: id });
    }
  });
});
app.delete('/schedule/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM schedule WHERE id = ?';

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Ошибка при удалении урока:', err);
      res.status(500).json({ error: 'Ошибка при удалении урока' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Урок не найден' });
    } else {
      res.json({ message: 'Урок успешно удален', id: id });
    }
  });
});

// Маршрут для получения расписания по коду
app.get('/getScheduleByCode/:shareCode', (req, res) => {
  const { shareCode } = req.params;
  const sharedSchedule = shareCodeToSchedule[shareCode];

  if (sharedSchedule) {
    res.json(sharedSchedule);
  } else {
    res.status(404).json({ error: 'Расписание не найдено' });
  }
});

// Маршрут для получения данных из таблицы user_data
app.get('/user', (req, res) => {
  const sql = 'SELECT * FROM user_data';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы buttons
app.get('/buttons', (req, res) => {
  const sql = 'SELECT * FROM buttons';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы organizations
app.get('/organizations', (req, res) => {
  const sql = 'SELECT * FROM organizations';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы internships1
app.get('/internships1', (req, res) => {
  const sql = 'SELECT * FROM internships1';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для получения данных из таблицы landlord_data
app.get('/landlord', (req, res) => {
  const sql = 'SELECT * FROM landlord_data';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(results);
    }
  });
});
// Маршрут для проверки пользователя
app.post('/validate-user', (req, res) => {
  const { username, password } = req.body;

  console.log('Auth:');
  const config = {
    url: 'LDAP://212.192.128.126',
    baseDN: 'dc=domain,dc=com'
  };

  const ad = new ActiveDirectory(config);

  ad.authenticate(username, password, function (err, auth) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return res.status(500).json({ error: 'Authentication failed' });
    }

    if (auth) {
      console.log('Authenticated!');
      return res.json({ message: 'Authentication successful' });
    } else {
      console.log('Authentication failed!');
      return res.status(401).json({ error: 'Authentication failed' });
    }
  });
});

// Установка порта и запуск сервера
const port = 3001;
const server = app.listen(port, '212.192.134.23', () => {
  console.log(`Сервер запущен на порту ${port}`);
});

// Функция для перезапуска сервера
function restartServer(server) {
  
  server.on('error', (err) => {
    
    console.error(`Произошла ошибка: ${err.message}`);
   
    server.close(() => {
      process.exit(1);
    });
  });
  
  server.on('close', () => {
   
    console.log('Сервер закрыт');
   
    setTimeout(() => {
      server.listen(port, '212.192.134.23', () => {
        console.log(`Сервер перезапущен на порту ${port}`);
      });
    }, 5000);
  });
}


restartServer(server);
