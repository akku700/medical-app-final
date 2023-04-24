const express = require("express");
require("./conn");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const globalErrorHandler = require("./error/globalErrorHandler");
const userRouter = require("./routers/userRouter");
const AppError = require("./error/AppError");
const productRouter = require('./routers/productRouter');
const like_unlike_router = require('./routers/likeandunlikRouter')
const commentRouter = require('./routers/commentRouter')

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/product", productRouter);
app.use('/like_unlike', like_unlike_router)
app.use('/comment', commentRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError("This router is not available" + " => " + req.url),
    400
  );
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
  console.log("server listening on port " + port);
});



