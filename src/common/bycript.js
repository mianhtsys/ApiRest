import bcrypt from "bcrypt";
import config from "../config/env.js";
import logger from "../logs/logger.js";

export const encriptar = async (texto) => {
  try {
    const salt = await config.BYCRYPT_SALT_ROUNDS
    const hash = await bcrypt.hash(texto, salt);
    return hash;
  } catch (error) {
    logger.error(error);
    throw new Error("Error al encriptar el texto");
  }
};


export const comparar = async (texto, hash) => {
  try {
    return await bcrypt.compare(texto, hash);
  } catch (error) {
    logger.error(error);
    throw new Error("Error al comparar el texto con el hash");
  }
}