const Joi = require("joi");
const User = require("../models/userData");
const path = require("path");
const response = require("../utils/responseHandler");
const { STATUS } = require("../config/constants");
const { Worker } = require("worker_threads");
const error_script = path.join(__dirname, "../error_log_worker.js");
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers.length === 0) {
      response.responseHandler(
        res,
        STATUS.NOT_FOUND,
        [],
        [{ message: "error fetching datas" }]
      );
    } else {
      response.responseHandler(
        res,
        STATUS.SUCCESS,
        allUsers,
        [],
        "tempp",
        true
      );
    }
  } catch (e) {
    response.responseHandler(res, STATUS.BAD_REQUEST, [], [{ message: e }]);
  }
};

const saveUsers = async (req, res) => {
  let errorObj = {};

  try {
    let body = req.body;

    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      age: Joi.string().required(),
    });

    let finalUser = { ...body };
    let userbody = userSchema.validate(finalUser);

    errorObj = {
      level: "error",
      heading: `Error while post route on saveusers`,
      page: "userController",
      functionName: "saveUsers",
    };
    if (userbody.error) {
      //validation errors
      errorObj["level"] = "validation-error";
      errorObj["detail"] = userbody.error.message;
      errorLoggerFunction(errorObj);
      response.responseHandler(
        res,
        STATUS.BAD_REQUEST,
        [],
        [{ message: userbody.error.message }]
      );
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
      });
      try {
        const result = await user.save();
        response.responseHandler(
          res,
          STATUS.SUCCESS,
          result,
          [],
          "tempp",
          true
        );
      } catch (e) {
        response.responseHandler(res, STATUS.BAD_REQUEST, [], [{ message: e }]);
      }
    }
  } catch (e) {
    errorObj["detail"] = e.message;
    errorLoggerFunction(errorObj);
    response.responseHandler(res, STATUS.BAD_REQUEST, [], [{ message: e }]);
  }
};

const updateUser = async (req, res) => {
    let errorObj = {};
  try {
    let body = req.body;
    const { id } = req.params;
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      age: Joi.string().required(),
    });

    let finalUser = { ...body };
    let userbody = userSchema.validate(finalUser);

    errorObj = {
        level: "error",
        heading: `Error while put route on saveusers`,
        page: "userController",
        functionName: "updateuser",
    };

    if (userbody.error) {
      //   validation errors
      errorObj["level"] = "validation-error with put method";
      errorObj["detail"] = userbody.error.message;
      errorLoggerFunction(errorObj);
      response.responseHandler(
        res,
        STATUS.BAD_REQUEST,
        [],
        [{ message: userbody.error.message }]
      );
    } else {
      const result = await User.findByIdAndUpdate(id, finalUser, {
        runValidators: true,
        new: true,
      });
      response.responseHandler(res, STATUS.SUCCESS, result, [], "", true);
    }
  } catch (e) {
    errorObj["detail"] = error.message;
    errorLoggerFunction(errorObj);
    response.responseHandler(res, STATUS.BAD_REQUEST, [], [{ message: e }]);
  }
};

function errorLoggerFunction(errlogObject) {
  let errorData = { ...errlogObject };
  errorData["createdAt"] = new Date();
  const errWorker = new Worker(error_script, {
    errorData: { num: errorData },
  });

  errWorker.postMessage({ status: "connect" });
  errWorker.on("message", (incoming) => {
    if (incoming.status == "connectiondone") {
      errWorker.postMessage({ status: "cansave", data: errorData });
    }
  });

  errWorker.on("error", (err) => {
    console.log("Error in logging errorLoggerFunction in userController");
    console.log(err);
  });
  errWorker.on("exit", () => console.log("exit -> in userController"));
}

module.exports = {
  getAllUsers,
  saveUsers,
  updateUser,
};
