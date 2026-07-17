"use strict";
// CLI: create an admin user (bcrypt-hashed) in the gitignored users.json.
// Usage (interactive):        npm run adduser
// Usage (args):               npm run adduser -- "Said" said@albatros.uz "mypassword"
const readline = require("readline");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { loadUsers, saveUsers, USERS_PATH } = require("../src/users");

function ask(rl, question, { silent = false } = {}) {
  return new Promise((resolve) => {
    if (!silent) return rl.question(question, (a) => resolve(a.trim()));
    // Masked input for the password.
    process.stdout.write(question);
    const stdin = process.stdin;
    const onData = (char) => {
      const s = char.toString("utf8");
      if (s === "\n" || s === "\r" || s === "") {
        stdin.removeListener("data", onData);
      }
    };
    stdin.on("data", onData);
    rl._writeToOutput = () => process.stdout.write("*");
    rl.question("", (a) => {
      rl._writeToOutput = (str) => process.stdout.write(str);
      process.stdout.write("\n");
      resolve(a.trim());
    });
  });
}

async function main() {
  const [argName, argEmail, argPassword] = process.argv.slice(2);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = argName || (await ask(rl, "Имя: "));
  const email = argEmail || (await ask(rl, "Email: "));
  const password = argPassword || (await ask(rl, "Пароль: ", { silent: true }));
  rl.close();

  if (!name || !email || !password) {
    console.error("Ошибка: имя, email и пароль обязательны.");
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Ошибка: пароль должен быть не короче 6 символов.");
    process.exit(1);
  }

  const users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    console.error(`Ошибка: пользователь с email ${email} уже существует.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  users.push({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);

  console.log(`\nПользователь создан: ${name} <${email}>`);
  console.log(`Хранится в: ${USERS_PATH} (в .gitignore, в git не попадает).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
