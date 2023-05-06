import { size } from "lodash";
import {
  REGEX_USERNAME,
  REGEX_EMAIL,
  REGEX_PASSWORD,
  WHITE_LIST_IMAGE,
} from "../constants";

export const ValidateUserName = (username) => {
  const regex = new RegExp(REGEX_USERNAME);
  return regex.test(username);
};
export const ValidatePassword = (password) => {
  const regex = new RegExp(REGEX_PASSWORD);
  return regex.test(password);
};
export const ValidateEmail = (email) => {
  const regex = new RegExp(REGEX_EMAIL);
  try {
    return regex.test(email);
  } catch (error) {
    console.log(error);
    return false;
  }
};

// function accent remove vietnamese
export const removeVietnameseTones = (str) => {
  if (str) {
    const newstr = str
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return newstr.replace(/đ/g, "d").replace(/Đ/g, "D");
  }
  return "";
};

export const checkTypeImage = (type) => {
  return WHITE_LIST_IMAGE.includes(type);
};

export const checkSizeImage = (size) => {
  return size < 50 * 1024 * 1024;
};
