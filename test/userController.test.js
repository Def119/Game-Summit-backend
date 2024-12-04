import {
  logIn,
  signUp,
  getArticles,
  getGames,
  getGameInfo,
  postReview,
  getReviews,
  getArticle,
  postInquiry,
  deleteReview,
  checkExistingReview,
} from "../controllers/userController.js";
import User from "../model/userModel.js";
import Moderator from "../model/moderatorModel.js";
import Game from "../model/gameModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { describe, vi, it, expect, beforeEach } from "vitest";
import Game from "../model/gameModel.js";
import Review from "../model/reviewsModel.js";

vi.mock("../model/userModel.js", { spy: true }, async () => {
  return {
    default: {
      login: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
    },
  };
});
vi.mock("../model/moderatorModel.js", { spy: true }, async () => {
  return {
    default: {
      login: vi.fn(),
      findOne: vi.fn(),
    },
  };
});
vi.mock("../model/gameModel.js", { spy: true }, async () => {
  return {
    default: {
      find: vi.fn(),
      findById: vi.fn(),
      findOne: vi.fn(),
      updateOne: vi.fn(),
    },
  };
});

vi.mock("jsonwebtoken", { spy: true }, async () => {
  return {
    default: {
      sign: vi.fn(),
    },
  };
});
vi.mock("bcrypt", { spy: true }, async () => {
  return {
    default: {
      compare: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});
describe("Login testing", () => {
  it("should login with correct user credentials for user", async () => {
    const req = {
      body: {
        email: "john.doe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock the User login
    User.login.mockResolvedValue({ id: "modarator123" });
    jwt.sign.mockReturnValue("mockToken");

    await logIn(req, res);

    expect(User.login).toHaveBeenCalledTimes(1);
    expect(User.login).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(res.json).toHaveBeenCalledWith({
      moderator: false,
      admin: false,
      token: "mockToken",
    });
  });
  it("should login with correct user credentials for moderator", async () => {
    const req = {
      body: {
        email: "john.doe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    User.login.mockResolvedValue(false);
    Moderator.login.mockResolvedValue({ id: "user123" });
    jwt.sign.mockReturnValue("mockToken");

    await logIn(req, res);

    expect(Moderator.login).toHaveBeenCalledTimes(1);
    expect(Moderator.login).toHaveBeenCalledWith(
      req.body.email,
      req.body.password
    );
    expect(res.json).toHaveBeenCalledWith({
      moderator: true,
      admin: false,
      token: "mockToken",
    });
  });
  it("should login with correct user credentials for admin", async () => {
    const req = {
      body: {
        email: "admin@g.com",
        password: "test_password",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    User.login.mockResolvedValue(false);
    Moderator.login.mockResolvedValue(false);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    await logIn(req, res);

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      req.body.password,
      process.env.ADMIN_PASSWORD
    );
    expect(res.json).toHaveBeenCalledWith({
      moderator: false,
      admin: true,
      token: "mockToken",
    });
  });
});

describe("SignUP testing", () => {
  it("should sign up with correct user credentials for a new user", async () => {
    const req = {
      body: {
        username: "john",
        email: "john.doe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock User.findOne to simulate no existing user
    User.findOne.mockResolvedValue(null);

    // Mock the User constructor and its save method
    const mockUserId = "123"; // Simulate a generated user ID
    const mockSave = vi.fn().mockImplementation(function () {
      this.id = mockUserId; // Assign a mock ID when saved
    });

    User.mockImplementation(() => ({
      save: mockSave,
    }));

    // Mock jwt.sign to return a mock token
    jwt.sign.mockReturnValue("mockToken");

    // Call the function under test
    await signUp(req, res);

    // Assertions
    const email = req.body.email;

    // Check if User.findOne was called with correct arguments
    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User.findOne).toHaveBeenCalledTimes(1);

    // Check if the user's save method was called
    expect(mockSave).toHaveBeenCalledTimes(1);

    // Check if jwt.sign was called with correct payload and options
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUserId },
      process.env.SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User signed up successfully",
      token: "mockToken",
    });
  });
  it("should not sign up with correct user credentials if user exist", async () => {
    const req = {
      body: {
        username: "john",
        email: "john.doe@example.com",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock User.findOne to simulate no existing user
    User.findOne.mockResolvedValue({ id: "123" });

    // Call the function under test
    await signUp(req, res);

    // Assertions
    const email = req.body.email;
    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });
});

describe("GetGames testing", () => {
  it("should find the game with a query", async () => {
    const req = {
      query: {
        q: "test",
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const mockGamesList = [
      {
        gameName: "Test Game",
        userRating: 4.5,
        image: "test-image.jpg",
        category: "Action",
        coverPhoto: "test-cover.jpg",
      },
    ];
    Game.find.mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockGamesList),
    });
    await getGames(req, res);

    expect(Game.find).toHaveBeenCalledWith(
      { gameName: { $regex: "test", $options: "i" } },
      "gameName userRating image category coverPhoto"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockGamesList);
  });
  it("should give all the games", async () => {
    const req = {
      query: {
        q: null,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const mockGamesList = [
      {
        gameName: "Test Game",
        userRating: 4.5,
        image: "test-image.jpg",
        category: "Action",
        coverPhoto: "test-cover.jpg",
      },
    ];
    Game.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockGamesList),
        }),
      }),
    });
    await getGames(req, res);

    expect(Game.find).toHaveBeenCalledWith(
      {},
      "gameName userRating image category coverPhoto"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockGamesList);
  });
});

describe("getGameInfo testing", () => {
  it("should find the game data with a valid id", async () => {
    const req = {
      params: {
        id: "60b725f10c9c81b531fb01d6",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const mockGame = { name: "test", rating: 4 };
    Game.findById.mockResolvedValue(mockGame);

    await getGameInfo(req, res);

    expect(Game.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockGame);
  });

  it("should not find the game data with a valid id", async () => {
    const req = {
      params: {
        id: "60b725f10c9c81b531fb01d6",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const mockGame = null;
    Game.findById.mockResolvedValue(mockGame);

    await getGameInfo(req, res);

    expect(Game.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Game not found" });
  });

  it("should return a error if the id not valid", async () => {
    const req = {
      params: {
        id: "invalid id",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getGameInfo(req, res);

    expect(Game.findById).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid game ID format",
    });
  });
});

vi.mock("../model/reviewsModel.js", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        save: vi.fn().mockResolvedValue({
          gameId: "60b725f10c9c81b531fb01d6",
          userId: "60b725f10c9c81b531fb01d6",
          reviewText: "testing",
          rating: 5,
          createdAt: new Date(), // Only include the saved fields
        }),
      };
    }),
  };
});

describe("postReview testing", () => {
  it("should add a game review", async () => {
    const req = {
      body: {
        id: "60b725f10c9c81b531fb01d6",
        reviewText: "testing",
        rating: 5,
      },
      user: {
        userId: "60b725f10c9c81b531fb01d6",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const mockGame = {
      _id: "60b725f10c9c81b531fb01d6",
      userRating: 4.5,
      usersRated: 10,
    };

    Game.findOne.mockResolvedValue(mockGame);
    Game.updateOne.mockResolvedValue({});

    await postReview(req, res);

    // Corrected expectation for `res.json`
    expect(res.status).toHaveBeenCalledWith(201);

    // Verify Game.findOne and Game.updateOne calls
    expect(Game.findOne).toHaveBeenCalledWith({ _id: req.body.id });
    expect(Game.updateOne).toHaveBeenCalledWith(
      { _id: req.body.id },
      {
        $set: {
          userRating:
            (mockGame.userRating * mockGame.usersRated + req.body.rating) /
            (mockGame.usersRated + 1),
          usersRated: mockGame.usersRated + 1,
        },
      }
    );
  });
});
