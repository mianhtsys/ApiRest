import { User } from '../models/users.js';
import { Task } from '../models/tasks.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bycript.js';
import { Op } from "sequelize";

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'password', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE 
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  console.log('entro al controlador');
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password, 
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username', 'password', 'status'],
      where: {
        id,
      },
    });
    if (!user) res.status(404).json({ message: 'User not found' });
    res.json(user);

  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
   if (!username && !password) {
       return res 
       .status(400)
       .json({ message: 'Username and password are required' });
    }

    const passwordEncriptado = await encriptar(password)

    const user = await User.update({
      username, 
      password: passwordEncriptado,
    }, {
      where: {
        id,
      },
    })
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
     await User.destroy({
      where: {
        id,
      },
    });
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  } 
}

async function activeInative(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if(!status)
      res.status(400).json({ message: 'Status is required' });
    
    const user = await User.findByPk(id);
    if (!user) res.status(404).json({ message: 'User not found' });
    
    if(user.status === status)
      return res.status(409).json({ message: 'Same status' });
    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function getTasks(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include: [
        {
          model: Task,
          attributes: ['name', 'done'],
          // where: {
          //   done: false,
          // }
        }
      ],
      where: {
        id,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function pagination(req, res, next) {
  const {
    page = 1,
    limit = 10,
    search = '',
    orderBy = 'id',
    orderDir = 'DESC',
  } = req.query;

  const allowedLimits = [5, 10, 15, 20];
  const parsedLimit = parseInt(limit);

  if (!allowedLimits.includes(parsedLimit)) {
    return res.status(400).json({
      error: `El parámetro 'limit' solo puede ser uno de los siguientes valores: ${allowedLimits.join(', ')}`,
    });
  }

  const offset = (page - 1) * parsedLimit;

  try {
    const users = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      where: {
        status: Status.ACTIVE,
        ...(search && {
          username: { [Op.iLike]: `%${search}%` }
        })
      },
      order: [[orderBy, orderDir.toUpperCase()]],
      limit: parsedLimit,
      offset,
    });

    res.json({
      total: users.count,
      page: parseInt(page),
      totalPages: Math.ceil(users.count / parsedLimit),
      data: users.rows,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  activeInative,
  getTasks,
  pagination,
};