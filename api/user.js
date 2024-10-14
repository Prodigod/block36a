const express = require("express");
const router = express.Router();
const prisma = require("../prisma/index");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: { playlists: true },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/playlists", async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: +id,
      },
    });

    res.status(201).json(newPlaylist);
  } catch (e) {
    next(e);
  }
});

// - `GET /users` sends array of all users
// - `GET /users/:id` sends the user specified by id.
//   - The response should include all playlists owned by the user.
// - `POST /users/:id/playlists` creates a new playlist owned by the user specified by id
module.exports = router;
