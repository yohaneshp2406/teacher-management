import bcrypt from "bcrypt"

const password = "secret123"

const hashedPassword = await bcrypt.hash(password, 10)

console.log("Hash:", hashedPassword)

const isMatch = await bcrypt.compare(
    "secret1234",
    hashedPassword
)

console.log("Password matched:", isMatch)
