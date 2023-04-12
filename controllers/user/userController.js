import User from "../../models/user.js";
import bcrypt from "bcrypt";
import Usersql from "../../models/usersql.js";
import Book from "../../models/book.js";






/* const show = async (req, res) => {
  const userId = req.params.id;
  const books = await Book.find();
  const userWishes = await Userhaswish.find({ userId });
  const bookIds = userWishes.map(userWish => userWish.bookId);
  const favoriteBooks = books.filter(book => bookIds.includes(book._id));
  res.render('user/show', { favoriteBooks });
};


 */





// crear usuario
const create = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username.toLowerCase();
    let data = {
      username: username,
      password: hashedPassword,
      email: req.body.email,
      role: "user",
    };

    let user = await User.create(data);
    let userslq = await Usersql.create({ username });
    res.redirect("/login");
  } catch (error) {
    throw new Error(error);
    res.redirect("/register?error=" + error.message);
  }
};

/* async function addFavorite(iduser, idbook) {
  try {
    // Buscar usuario
    const user = await Usersql.findByPk(iduser);
    if (!user) throw new Error("El usuario no existe");

    // Buscar libro
    const book = await Book.findByPk(idbook);
    if (!book) throw new Error("El libro no existe");

    // Verificar si el libro ya está en favoritos
    const favorite = await user.hasBook(book);
    if (favorite) {
      throw new Error("El libro ya está en favoritos");
    }

    // Agregar libro a favoritos
    await user.addBook(book);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function removeFavorite(userId, bookId) {
  try {
    // Buscar usuario
    const user = await User.findByPk(userId);
    if (!user) throw new Error("El usuario no existe");

    // Buscar libro
    const book = await Book.findByPk(bookId);
    if (!book) throw new Error("El libro no existe");

    // Verificar si el libro fue agregado a favoritos
    const favorite = await user.hasBook(book);
    if (!favorite) {
      throw new Error("El libro no fue agregado a favoritos");
    }

    // Eliminar libro de favoritos
    await user.removeBook(book);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
 */
// login
const login = async (req, res) => {
  const username = req.body.username.toLowerCase();
  let user = await User.findOne({ username: username });
  if (!user) {
    res.status(404).send("El usuario no existe");
    return;
  }
  let password = req.body.password;
  if (await bcrypt.compare(password, user.password)) {
    // user.password del has y el otro sin ecncriptacion
    res.send("Usuario y contraseña correctos");
  } else {
    res.status(401).send("Contraseña incorrecta");
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

//login form

const loginForm = async (req, res) => {
  res.render("user/login");
};

const registerForm = async (req, res) => {
  const error = req.query.error;
  res.render("user/register", { message: error });
};




const updateForm = async (req, res) => {
  let username = req.params.username;
  let user = await getByUsername(username);
  res.render("user/edit", { userToEdit: user });
};


// Get all users
const getAll = async (req, res) => {
  try {
    const auth = req.user;
    const users = await User.find();
    console.log(users);
        res.render('user/list',{users: users,auth:auth});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get user
const getById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      return user; 
  } catch (error) {
    return error; }
} 


// Get user
const getByUsername = async (username) => {
  try {
      const user = await User.findOne({username: username});
return user;
  } catch (error) {
return error;  }
}



// Update user
const update = async (req, res) => {
  console.log("file",req.file);
  const {password, email, role } = req.body;
  let hashedPassword = "";
  if (password !== "") {
      hashedPassword = await bcrypt.hash(password,10);
  }
  try {

      const user = await getByUsername(req.params.username);
      user.password = password !== "" ? hashedPassword : user.password;
      user.email = email !== "" ? email : user.email;
      user.role = role !== "" ? role : user.role;
      if (req.file) {
          console.log("file",req.file.path.split("public")[1]);
          user.avatar = req.file.path.split("public")[1];
      }
      const updatedUser = await user.save();
      res.redirect("/users");
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
}

// Delete user
const deletes = async (req, res) => {
  try {
    let username = req.params.username;
      await User.findOneAndRemove({username:username});
      res.status(200).json({ message: "User deleted" });
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}






const showProfile = async function(req, res) {
  const username = req.params.username;

  try {
    const user = await getByUsername(req.params.username);
    if (!user) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    const favorites = await Book.showFavorites({ username: { $in: user.favorites } });
    const uploads = await Book.find({ uploader: user.username });

    res.render("user/profile", { user: user, favorites: favorites, uploads: uploads });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los datos del usuario");
  }
};


export default {
  create,
  login,
  loginForm,
  registerForm,
  updateForm,
  getAll,
  getById,
  logout,
  getByUsername,
  showProfile,
  //addFavorite,
  //removeFavorite,
  update,
  deletes,
};
