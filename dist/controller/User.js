"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../services/prisma");
class User {
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const userExists = yield prisma_1.prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (!userExists) {
                    return res.status(400).json({ error: "Invalid email or password" });
                }
                return bcryptjs_1.default.compare(password, userExists.password).then((result) => {
                    if (result) {
                        const token = jsonwebtoken_1.default.sign({
                            id: userExists.id,
                            name: userExists.name,
                            email: userExists.email,
                        }, process.env.SECRET_KEY, {
                            expiresIn: 86400,
                            noTimestamp: true,
                        });
                        const authData = {
                            id: userExists.id,
                            email: userExists.email,
                            name: userExists.name,
                        };
                        const { name, email, id } = authData;
                        res.header("doceifancia.auth", token);
                        return res.status(200).json({ name, email, id, token });
                    }
                    else {
                        return res.status(400).json({ error: "User or password invalid" });
                    }
                });
            }
            catch (error) { }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            const salt = bcryptjs_1.default.genSaltSync(14);
            try {
                const userAlreadyExists = yield prisma_1.prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (userAlreadyExists) {
                    return res.status(400).json({ error: "User already exists" });
                }
                yield prisma_1.prisma.user.create({
                    data: {
                        name,
                        email,
                        password: bcryptjs_1.default.hashSync(password, salt),
                    },
                });
                return res.status(201).json({ message: "User created successfully!" });
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    personalProfile(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (token) {
                return jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (authorization, secretToken) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const retrieveUser = yield prisma_1.prisma.user.findMany({
                            where: {
                                email: secretToken.email,
                            },
                        });
                        res.status(200).json(retrieveUser[0]);
                    }
                    catch (error) {
                        res.status(404).json({ error: "User not found" });
                    }
                }));
            }
            else {
                res.status(404).send("erro");
            }
        });
    }
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: false,
                    },
                });
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.User = User;
