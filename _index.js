const express = require('express');
const cors = require('cors');
const bodyParser =require('body-parser');
// const mongoose = require('mongoose');
const {MongoClient, ObjectId} = require('mongodb');
const multer = require('multer');
const path = require('path');
const server = express();
const cloudinary = require('./config/cloudinaryConfig');
const {CloudinaryStorage} = require('multer-storage-cloudinary')

const mongoURL = 'mongodb+srv://lehanselaka:Ammasandaki@testrad.9qpuq.mongodb.net/'

const userRoutes = require('./routes/userRoutes');
const {mongoose } = require('mongoose');


mongoose.connect(mongoURL);


server.use(cors());
server.use(bodyParser.json());
server.use(express.urlencoded({extended:false}));
const database = new MongoClient(mongoURL);


server.use(userRoutes)

server.get('/',(req,res)=>{
    console.log("badu dennada?");
    res.send("asdasdasd");
})



// Route to get all moderators - when routed to moderators from dashboard
// server.get('/moderators', async (req, res) => {
//     try {
//         const {collection:moderators} = await databaseConnect('Moderators');
//         const allModerators = await moderators.find().toArray(); // Fetch all moderators
//         res.status(200).json(allModerators);
//     } catch (error) {
//         console.error('Error fetching moderators:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// server.delete('/moderators/:id', async (req, res) => {
//     const { id } = req.params;
//     console.log(id);
//     try {
//       const { collection:moderators } = await databaseConnect("Moderators");
  
//       const result = await moderators.deleteOne({ _id: new ObjectId(id) });
  
//       if (result.deletedCount === 1) {
//         res.status(200).json({ message: 'Moderator removed successfully.' });
//       } else {
//         res.status(404).json({ message: 'Moderator not found.' });
//       }
//     } catch (error) {
//       console.error('Error deleting moderator:', error);
//       res.status(500).json({ message: 'Internal server error.' });
//     }
//   });
  

// fetch games and search filter by title
// server.get('/games', async (req, res) => {
//     const searchTerm = req.query.q;  // Get the search term from the query parameter
//     console.log(searchTerm);
    
//     try {
//       const {collection: games} = await databaseConnect("Games"); // Connect to the database
      
//       let gamesList;
  
//       if (searchTerm) {
//         // Perform a case-insensitive search on the gameName field and project the desired fields
//         gamesList = await games
//           .find(
//             { gameName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
//             { projection: { gameName: 1, userRating: 1, image: 1 , category: 1, coverPhoto:1} } // Include only these fields
//           )
//           .toArray(); // Convert the result to an array
//       } else {
//         // Fetch all games, sort by userRating, limit to 12, and project the desired fields
//         gamesList = await games
//           .find(
//             {}, // No filter, get all documents
//             { projection: { gameName: 1, userRating: 1, image: 1 , category:1 } } // Include only these fields
//           )
//           .sort({ userRating: -1 }) // Sort by rating in descending order
//           .limit(12)
//           .toArray(); // Convert the result to an array
//       }
  
//       // Send the filtered list of games as the response
//       res.status(200).json(gamesList);
//     } catch (err) {
//       console.error('Error fetching games:', err);
//       res.status(500).json({ message: 'Failed to fetch games' });
//     }
//   });
  

//Get specific game info
// server.get('/games/:id', async (req, res) => {
//     let gameId = req.params.id; // Get the game ID from the request parameters
//     console.log(gameId);

//     try {
//         const { collection: games } = await databaseConnect("Games");

//         // Convert the string ID to ObjectId
//         const gameObjectId = new ObjectId(gameId);
//         console.log(gameObjectId);
//         const game = await games.findOne({ _id: gameObjectId });

//         if (game) {
//             console.log(game.json)
//             res.status(200).json(game);
//         } else {
//             res.status(404).json({ message: 'Game not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching game:', error);
//         res.status(500).json({ message: 'Failed to fetch game' });
//     }
// });

// Update Game



// server.put('/games/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedGame = req.body;
//     delete updatedGame._id;

//     const { collection: games } = await databaseConnect('Games');

//     const result = await games.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updatedGame }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: 'Game not found' });
//     }

//     res.status(200).json({ message: 'Game updated successfully' });
//   } catch (error) {
//     console.error('Error updating game:', error);
//     res.status(500).json({ message: 'Failed to update game' });
//   }
// });

// Delete Game with id (admin)
// server.delete('/games/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { collection: games } = await databaseConnect('Games');

//     // OF THERE ARE REVIEWS< TEHY SHOULD DELETE TOO!

//     const result = await games.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'Game not found' });
//     }

//     res.status(200).json({ message: 'Game deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting game:', error);
//     res.status(500).json({ message: 'Failed to delete game' });
//   }
// });

// ARTICELS
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'your_folder_name', // Name of the folder to store the images in Cloudinary
      allowedFormats: ['jpg', 'png'], // Specify allowed formats
    },
  });

  const upload = multer({ storage });

// server.post('/add-article', upload.array('images', 5), async (req, res) => {
// try {
//     const { title, content } = req.body;
//     const images = req.files.map(file => file.path); // Cloudinary returns the full URL in `file.path`
    
//     const { collection: articles } = await databaseConnect("Articles");
//     const newArticle = { title, content, images, createdAt: new Date() };

//     await articles.insertOne(newArticle);

//     res.status(201).json({ message: 'Article added successfully', article: newArticle });
// } catch (error) {
//     console.error('Error adding article:', error);
//     res.status(500).json({ message: 'Failed to add article' });
// }
// });

//get articles
// server.get('/articles', async (req, res) => {
//     try {
//         const {collection: articles} = await databaseConnect("Articles");

//         const articleList = await articles.find().toArray();
//         res.status(200).json(articleList);
        
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to fetch articles' });
//     }
// });


// server.post('/add-game', upload.fields([
//   { name: 'coverPhoto', maxCount: 1 },
//   { name: 'inGameCaptures[]', maxCount: 5 },
// ]), async (req, res) => {
//   try {
//     const { gameName, category, releaseDate, platforms, awards, description, introSentence, ageRating } = req.body;
    
//     // Cloudinary URLs
//     const coverPhoto = req.files.coverPhoto ? req.files.coverPhoto[0].path : null;
//     const inGameCaptures = req.files['inGameCaptures[]'] ? req.files['inGameCaptures[]'].map(file => file.path) : [];
    
//     const { collection: games } = await databaseConnect('Games');
    
//     const newGame = {
//       gameName,
//       category,
//       userRating: 0,
//       usersRated: 0,
//       releaseDate,
//       platforms: JSON.parse(platforms),
//       awards,
//       description,
//       introSentence,
//       ageRating,
//       coverPhoto,
//       inGameCaptures,
//       createdAt: new Date(),
//     };
    
//     await games.insertOne(newGame);
    
//     res.status(201).json({ message: 'Game added successfully', game: newGame });
//   } catch (error) {
//     console.error('Error adding game:', error);
//     res.status(500).json({ message: 'Failed to add game' });
//   }
// });





// REVIEWS
// server.post('/add-review', async (req, res) => {
//   try {
//     const { id, reviewText, rating } = req.body; ///     ADD user ID too ??????

//     if (!id) {
//       return res.status(400).json({ error: 'Game ID is required' });
//     }

//     const { collection: reviews } = await databaseConnect('Reviews');
//     const { collection: games } = await databaseConnect('Games');

//     // Create the review object
//     const newReview = {
//       id,
//       reviewText,
//       rating: Number(rating),
//       createdAt: new Date(),
//     };

//     // Insert the new review
//     await reviews.insertOne(newReview);

//     // Update the game's rating and number of users rated
//     const game = await games.findOne({ _id: new ObjectId(id)});

//     if (game) {
//       const newUserRating = (game.userRating * game.usersRated + Number(rating)) / (game.usersRated + 1);
//       await games.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { userRating: newUserRating, usersRated: game.usersRated + 1 } }
//       );
//     }
  
//     res.status(201).json({ message: 'Review and game rating updated successfully', review: newReview });
//   } catch (error) {
//     console.error('Error adding review:', error);
//     res.status(500).json({ message: 'Failed to add review' });
//   }
// });


// Express.js route to get at least 7 reviews for a specific game
// server.get('/reviews/:gameId', async (req, res) => {
//   const { gameId } = req.params;
//     console.log("gae id is " + gameId); 
//   try {
//     const { collection: reviewsCollection } = await databaseConnect('Reviews'); // Connect to the Reviews collection

//     // Fetch up to 7 reviews for the given gameId
//     const reviews = await reviewsCollection
//       .find({id:gameId}, { projection: { reviewText: 1, rating: 1, createdAt: 1 } }) // Adjust the fields as needed
//       .limit(7) // Limit the results to 7 reviews
//       .toArray();

//       console.log("enne nane" + reviews)
//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     res.status(500).json({ message: 'Failed to fetch reviews' });
//   }
// });
  
 

    //assert connection to database
async function databaseConnect(collectionName) {
    try {
        await database.connect();
        console.log('Connected to MongoDB');
        const db = database.db("GameSummit");
        const collection = db.collection(collectionName);
        console.log('Database and collection accessed');
        return { db, collection };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

    //start server
async function startServer() {
    try {
        // const { db, collection } = await databaseConnect();
        
        server.listen(3001, () => {
            console.log("Server running on port 3001");
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();