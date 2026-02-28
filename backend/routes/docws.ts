import express from "express";

const docwsRoute = express.Router();

docwsRoute.get("/:docId", async (req, res) => {
  console.log(req.params.docId);
  res.send("in ws");
});



export { docwsRoute };
