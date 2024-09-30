require("dotenv").config(); //initializes dotenv
const Discord = require("discord.js"); //imports discord.js
const axios = require("axios");

//MEME API KEY
const API_KEY = process.env.MEME_API_KEY

//rapidapi weather api 
const WEATHER_KEY = process.env.RAPIDAPI-KEY

const PREFIX = "!"

let ranNum = Math.floor(Math.random() * 5)

//returns weather of selected city
async function getWeather() {
  
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
async function getSearchMemes(keywords)
{
  const url = "https://api.apileague.com/search-memes" 
  const res = await axios.get(url,
    {
      headers: {
        "x-api-key": API_KEY,
      },
      params: { 
        "keywords": keywords,
        "Keywords-in-image": true,
        "number": 5
      }
    }
  )
  console.log(url)
  console.log(keywords)
  console.log(res.data.memes)
  return res.data.memes[ranNum].url
}

async function getGifMemes(query) {
  const url = "https://api.apileague.com/search-gifs"
  const res = await axios.get(url,
    {headers: {
      "x-api-key": API_KEY,
    },
    params: {
      'query': query,
      'number': 5,
    }
  }
  )
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
});

client.on("messageCreate", async (msg) => {
  if (msg.content.startsWith(PREFIX)) {
    const [cmd, ...args] = msg.content.trim().substring(PREFIX.length).split(/\s+/)
    userInput = args.toString()
    console.log(userInput)
    switch(cmd) {
      case "hello":
        msg.reply("hello G!")
        break;
      case "meme":
        const meme = await getRandomMeme();
        // console.log(meme);
        if (meme) {
          msg.channel.send(meme);
        } else {
          console.log('error')
        }
        break;
      case "findMeme":
        const searchMeme = await getSearchMemes(userInput)
      if (searchMeme) {
        msg.channel.send(searchMeme)
      }
      else {
        console.log('error')
      }
      break;

    }
  //   if (cmd === 'hello') {
  //     msg.reply("Hello G!");
  //   }

  //   else if (cmd === "meme") {
  //     const meme = await getRandomMeme();
  //     // console.log(meme);
  //     if (meme) {
  //       msg.channel.send(meme);
  //     }
  //   }

  //   else if (cmd === "findMeme") {
  //     // if (args.length === 0) {return msg.reply("Enter the mee you want")}
  //     const searchMeme = await getSearchMemes(userInput)
  //     if (searchMeme) {
  //       msg.channel.send(searchMeme)
  //     }
  //     else {
  //       console.log('error')
  //     }
  //   }
  }
});

//this line must be at the very end
client.login(process.env.CLIENT_TOKEN); //signs the bot in with token
