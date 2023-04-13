import { Router } from "express";
import { isAuthorized, isAdmin } from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";
import favsController from "../../controllers/favs/favsController.js";
import users_has_wishes from "../../models/users_has_wishes.js";

const router = Router();

// Agregar libro a favoritos

router.post("/:username/favs/:idbook/add", isAuthorized, (req, res) => {
  favsController
    .addFavorite(req, res)
    .then(() => {
      res.redirect(`/users/user/profile/${req.user.username}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Ha ocurrido un error internorl");
    });
});

// Eliminar libro de favoritos
router.post("/:username/favs/:idbook/remove", isAuthorized, (req, res) => {
  favsController
    .removeFavorite(req, res)
    .then(() => {
      res.redirect(`/users/user/profile/${req.user.username}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Ha ocurrido un error interno probandoooooo");
    });
});

// Mostrar lista de libros favoritos
/* router.get("/:username/favs", isAuthorized, (req, res) => {
  const username = req.params.username;
  favsController
    .showFavorites(username)
    .then((user) => {
      res.render("user/favs", { user });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Ha ocurrido un error interno mazo tocho");
    });
}); */

export default router;
