// Teacher API Backend
// Feature test branch

import express from "express"
import pool from "./db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.post("/register", async (req, res) => {
    try {
        const {name, email, password, role} = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            })
        }

        const exisingUser = await pool.query(
            "select id from users where email = $1",
            [email]
        )

        if (exisingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `insert into users (name, email, password, role)
            values ($1, $2, $3, $4)
            returning id, name, email, role`,
            [
                name,
                email,
                hashedPassword,
                role || "user"
            ]
        )

        res.status(201).json({
            message: "User registered",
            user: result.rows[0]
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Registration failed"
        })
    }
})

app.post("/login", async (req,res) => {
    try {
        const {email,password} = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const result = await pool.query(
            "select * from users where email = $1",
            [email]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        res.json({
            message: "Login successful",
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Login failed"
        })
    }
})

app.get("/",(req, res) => {
    res.send("Teacher API is running")
})

app.get("/teachers", async (req,res) => {
    try {
        const result = await pool.query(
            "select * from teachers order by id"
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Failed to get teachers"
        })
    }
})

app.get("/teachers/:id", async (req,res) => {
    try {
        const teacherId = Number(req.params.id)
        
        const result = await pool.query(
            "select * from teachers where id = $1",
            [teacherId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Teacher not found"
            })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Failed to get teacher"
        })
    }
})

app.post("/teachers", async (req, res) => {
    try {
        const {name, score} = req.body

        if (!name || score === undefined) {
            return res.status(400).json({
                message: "Name and score are required"
            })
        }

        if (score < 0 || score > 100) {
            return res.status(400).json({
                message: "Score must be between 0 and 100"
            })
        }

        const result = await pool.query(
            `insert into teachers (name, score)
             values ($1, $2)
             returning *`,
             [name, score]
        )

        res.status(201).json({
            message: "Teacher created",
            teacher: result.rows[0]
        })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message: "Failed to create teacher"
      }) 
    }
})

app.patch("/teachers/:id", async (req,res) => {
    try {
        const teacherId = Number(req.params.id)
        const {name,score} = req.body

        if (
            score !== undefined &&
            (score < 0 || score > 100)
        ) {
            return res.status(400).json({
                message: "Score must be between 0 and 100"
            })
        }

        const result = await pool.query(
            `update teachers
             set
                name = coalesce($1, name),
                score = coalesce($2, score)
             where id = $3
             returning *`,
             [name, score, teacherId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Teacher not found"
            })
        }

        res.json({
            message: "Teacher updated",
            teacher: result.rows[0]
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Failed to update teacher"
        })
    }
})

app.delete("/teachers/:id", async (req,res) => {
    try {
        const teacherId = Number(req.params.id)

        const result = await pool.query(
            `delete from teachers
             where id = $1
             returning *`,
            [teacherId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Teacher not found"
            })
        }

        res.json({
            message: "Teacher deleted",
            teacher: result.rows[0]
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Failed to delete teacher"
        })
    }
})

app.get("/db-test", async(req,res) => {
    const result = await pool.query("SELECT NOW()")

    res.json({
        message: "Database connected",
        time: result.rows[0].now
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorization"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

app.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Protected profile",
        user: req.user
    })
})

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        next()
    }
}

app.get("/admin", authenticate, requireRole("admin"), (req,res) => {
    res.json({
        message: "Admin area"
    })
})