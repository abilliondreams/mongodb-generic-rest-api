const express = require("express");

const router = express.Router();


/**
 * @swagger
 * /api/v1/healthcheck:
 *  get:
 *    tags: [Health Check]
 *    description: Determine if server is running and ok.
 *    responses:
 *      "200":
 *        description: Server is OK.
 */
router.get("/", (req, res, next) => { 
  res.status(200).json({message: "OK"});
});

module.exports = router;