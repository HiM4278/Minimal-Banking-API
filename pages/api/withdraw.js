import { checkToken } from "../../backendLibs/checkToken";
import { writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });
    const user = checkToken(req);
    if (!user) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to deposit",
      });
    }
    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if (amount < 1) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    }
    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const foundUser = users.find((x) => x.username === user.username);

    if (amount > foundUser.money) {
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    }
    //return res.status(400).json({ ok: false, message: "You do not has enough money" });
    foundUser.money = foundUser.money - amount;
    if (foundUser.money < 0) {
      foundUser.money = 0;
    }
    writeUsersDB(users);
    return res.status(200).json({ ok: true, money: foundUser.money });
    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
