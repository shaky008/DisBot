require("dotenv").config(); //initializes dotenv
const Discord = require("discord.js"); //imports discord.js
const axios = require("axios");

//MEME API KEY
const OPEN_WEATHER_API = process.env.OPEN_WEATHER_API;

//rapidapi weather api
const API_KEY = process.env.MEME_API_KEY;

const PREFIX = "!";

let ranNum = Math.floor(Math.random() * 5);

//returns weather of selected city
async function getWeather(cityName) {
  try {
    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: cityName,
          appid: OPEN_WEATHER_API,
        },
      }
    );
    let weatherId = res.data.weather[0].id;
    if (weatherId >= 200 && weatherId <= 232) {
      console.log("thunderstorm");
      return "thunderstorm";
    } else if (weatherId >= 300 && weatherId <= 531) {
      console.log("raining");
      return "raining";
    } else if (weatherId >= 600 && weatherId <= 622) {
      console.log("snowing");
      return "snowing";
    } else if (weatherId >= 801 && weatherId <= 804) {
      console.log("cloudy");
      return "cloudy";
    } else if (weatherId === 800) {
      console.log("Clear");
      return "Clear Sky";
    }
    // console.log(weatherId);
  } catch (error) {
    // console.log(error)
  }
}

//when types !meme, returns a random meme from the API
async function getRandomMeme() {
  try {
    const res = await axios.get(
      "https://api.apileague.com/retrieve-random-meme",
      {
        headers: {
          "x-api-key": API_KEY, // Use your API key
        },
      }
    );
    // console.log(res.data.url);
    return res.data.url;
  } catch (error) {
    console.error("Error fetching meme:", error);
    return null; // Return null if something goes wrong
  }
}

// searches, returns specific keyworded meme to user
async function getSearchMemes(keywords) {
  const url = "https://api.apileague.com/search-memes";
  const res = await axios.get(url, {
    headers: {
      "x-api-key": API_KEY,
    },
    params: {
      keywords: keywords,
      "Keywords-in-image": true,
      number: 5,
    },
  });
  console.log(url);
  console.log(keywords);
  console.log(res.data.memes);
  if (res.data.available < ranNum) {
    ranNum = Math.floor(Math.random() * res.data.available);
  }
  return res.data.memes.length > 0
    ? res.data.memes[ranNum].url
    : "could not find";
}

async function getGifMemes(query) {
  try {
    const url = "https://api.apileague.com/search-gifs";
    const res = await axios.get(url, {
      headers: {
        "x-api-key": API_KEY,
      },
      params: {
        query: query,
        number: 5,
      },
    });
    if (res.data.images.length < ranNum) {
      ranNum = Math.floor(Math.random() * res.data.length);
    }
    return res.data.images[ranNum].url;
  } catch (error) {
    // console.log(error")
  }
}

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
}); //creates new client

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(getGifMemes("rain"))
  // getWeather("Khumjung")
});

client.on("messageCreate", async (msg) => {
  if (msg.content.startsWith(PREFIX)) {
    const [cmd, ...args] = msg.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    userInput = args.toString();
    console.log(userInput);
    switch (cmd) {
      case "hello":
        msg.reply("hello G!");
        break;

      case "meme":
      case "findMeme":
        let meme = null;
        if (userInput === "") {
          meme = await getRandomMeme();
        } else {
          meme = await getSearchMemes(userInput);
        }
        // console.log(meme);
        if (meme) {
          msg.channel.send(meme);
        } else {
          console.log("error");
        }
        break;

      case "weather":
        if (userInput === "") {
          msg.reply("please enter a cityname");
          return;
        }
        const query = await getWeather(userInput);
        const weatherGif = await getGifMemes(query);
        if (weatherGif) {
          msg.reply(query);
          console.log(weatherGif);
          msg.channel.send(weatherGif);
        } else {
          console.log("error with weather");
        }
    }
  }
});

//this line must be at the very end
client.login(process.env.CLIENT_TOKEN); //signs the bot in with token
