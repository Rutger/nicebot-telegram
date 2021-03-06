const TelegramBot = require('node-telegram-bot-api');
const uuid = require('uuid');
const responses = require('./responses.json');

require('dotenv').config();

function rollResponse() {
  return responses[Math.floor(Math.random() * responses.length)];
}

function rollEnding() {
  const endings = ['', '', '', '.', '!', '?!']; // 3 times nothing on purpose, most of the times we want no ending
  return endings[Math.floor(Math.random() * endings.length)];
}

function generateMessage() {
  return `${rollResponse()}${rollEnding()}`;
}

const token = process.env.NICEBOT_TOKEN;
const bot = new TelegramBot(token, {
  polling: true,
});

function mapResult(text) {
  return {
    id: uuid(),
    type: 'article',
    thumb_url:
      'https://raw.githubusercontent.com/rutger/emoj-telegram/master/icon.png',
    title: 'Roll',
    input_message_content: {
      message_text: text,
    },
  };
}

bot.on('inline_query', query => {
  const randomResult = mapResult(generateMessage());

  bot
    .answerInlineQuery(query.id, [randomResult], { cache_time: 0 })
    .catch(err => {
      console.log(`Something failed (sender: ${query.from.username})`, err);
    });
});

bot.on('message', message => {
  const text = message.text;
  const chatId = message.chat.id;

  if (text.startsWith('/')) {
    const helpText =
      'Simply send some text to use this bot! You can also use this service in other conversations by typing `@goedbot ` for example.';
    bot.sendMessage(chatId, helpText, {
      parse_mode: 'Markdown',
    });
    return;
  }

  bot.sendMessage(chatId, generateMessage());
});

module.exports = () => ({
  message: 'You have reached the nice-telegram API. There is no REST API yet.'
});
