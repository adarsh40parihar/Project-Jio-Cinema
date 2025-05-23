//  route test  -> extra library
const request = require("supertest");
const {
  protectRouteMiddleware,
} = require("../../Controllers/AuthController.js");
const { getUserWishList } = require("../../Controllers/UserController");

// Mock AuthRouter
jest.mock("../../Router/AuthRouter", () => {
  const express = require("express");
  const router = express.Router();
  return router;
});

// Mock the middleware and controllers
jest.mock("../../Controllers/AuthController", () => ({
  protectRouteMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../../Controllers/UserController", () => ({
  getUserWishList: jest.fn(),
  getCurrentUser: jest.fn(),
  getAllUser: jest.fn(),
  deleteUser: jest.fn(),
  isAdminMiddleWare: jest.fn((req, res, next) => next()),
  addToWishList: jest.fn(),
  deleteFromWishlist: jest.fn(),
}));

// Import the Express app
const app = require("../../api.js");

describe("UserRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /wishList", () => {
    it("should return wishlist when authorized", async () => {
      // Mock successful middleware authentication
      protectRouteMiddleware.mockImplementation((req, res, next) => next());

      // Mock wishlist response
      const mockWishlist = [{ id: 1, title: "Movie 1" }];
      getUserWishList.mockImplementation((req, res) => {
        res.status(200).json({
          data: mockWishlist,
          status: "success",
        });
      });

      const response = await request(app).get("/api/user/wishList");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockWishlist,
        status: "success",
      });
    });

    it("should handle errors in getUserWishList", async () => {
      protectRouteMiddleware.mockImplementation((req, res, next) => next());

      // Mock error in getUserWishList
      getUserWishList.mockImplementation((req, res) => {
        res.status(500).json({
          message: "Internal server error",
          status: "failure",
        });
      });

      const response = await request(app).get("/api/user/wishList");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Internal server error",
        status: "failure",
      });
    });
  });
});
