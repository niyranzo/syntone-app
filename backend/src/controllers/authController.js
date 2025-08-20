import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { userId: user.id_user },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 10800000,
            domain: '.railway.app'
        });

        const userWithoutPassword = {
            ...user.toJSON(),
            password: undefined
        };

        res.json({
            message: "Inicio de sesión exitoso",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error en el inicio de sesión" });
    }
};

// Registrar usuario
const register = async (req, res) => {
    try {
        const { email, username, password, type } = req.body;

        // Validaciones de existencia
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            type: type || 'user'
        });

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: {
                id_user: user.id_user,
                email: user.email,
                username: user.username,
                type: user.type
            }
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error en el registro del usuario" });
    }
};

// Cerrar sesión
const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
        domain: '.railway.app',
        path: '/'
    });

    res.json({ message: "Cierre de sesión exitoso" });
};

export { login, register, logout };
