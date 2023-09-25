import telebot # библиотека для работы с Telegram API
bot = telebot.TeleBot('6428703486:AAEmPxy9HtJVDA8VBD7OHiSWzzmx-xA-Hpg') # создаем объект бота с токеном
admin_id = '803555618' # ID администратора, которому будут приходить обращения

# создаем клавиатуру с кнопками
keyboard = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
keyboard.add('Предложения', 'Ошибки')
keyboard.add('Подать заявку на публикацию жилья', 'Подать заявку на сотрудничество')
keyboard.add('Подать заявку на публикацию мероприятия', 'Обратная связь')

# создаем клавиатуру с кнопкой назад
back_keyboard = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
back_keyboard.add('Назад')

# обрабатываем команду /start
@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(message.chat.id, 'Привет, я бот для общения с администрацией. Выбери одну из кнопок ниже.', reply_markup=keyboard)

# обрабатываем текстовые сообщения
@bot.message_handler(content_types=['text'])
def text(message):
    # если сообщение от администратора, то игнорируем его
    if message.chat.id == admin_id:
        return
    # если сообщение одно из предопределенных, то просим уточнить обращение и запоминаем название кнопки
    if message.text in ['Предложения', 'Ошибки', 'Подать заявку на публикацию жилья', 'Подать заявку на сотрудничество', 'Подать заявку на публикацию мероприятия', 'Обратная связь']:
        bot.send_message(message.chat.id, f'Ты выбрал {message.text}. Пожалуйста, напиши подробнее, что ты хочешь сообщить или спросить.')
        button_name = message.text # сохраняем название кнопки в переменную
    # если сообщение "Назад", то возвращаемся к выбору кнопок
    elif message.text == 'Назад':
        bot.send_message(message.chat.id, 'Хорошо, давай выберем другую кнопку.', reply_markup=keyboard)
    # иначе отправляем обращение администратору с заголовком кнопки и внутренностями и ником отправителя и показываем кнопку назад
    else:
        # проверяем, что сообщение имеет ответ
        if message.reply_to_message is not None:
            # получаем текст ответа
            reply_text = message.reply_to_message.text
            # получаем название кнопки из переменной
            button_name = button_name
        else:
            # устанавливаем текст ответа как пустую строку
            reply_text = ""
            # устанавливаем название кнопки как неизвестное
            button_name = "Неизвестно"
        bot.send_message(admin_id, f'Обращение от {message.from_user.username} ({button_name}):\n{reply_text}\n{message.text}')
        bot.send_message(message.chat.id, 'Спасибо за обращение. Мы постараемся ответить тебе в ближайшее время.', reply_markup=back_keyboard)


# запускаем бота
bot.polling()
