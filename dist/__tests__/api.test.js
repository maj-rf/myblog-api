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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../models/user");
const blog_1 = require("../models/blog");
const comment_1 = require("../models/comment");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = __importDefault(require("../app"));
const api = (0, supertest_1.default)(app_1.default);
let token = '';
let userID = '';
let blogID = '';
describe('auth routes', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.User.deleteMany({});
        const password = yield bcrypt_1.default.hash('secret', 10);
        const user = new user_1.User({
            username: 'default',
            email: 'default@gmail.com',
            password,
        });
        yield user.save();
        userID = user._id.toString();
    }));
    const baseAuth = `/api/auth`;
    describe('POST /api/auth/register', () => {
        test('user registration - success', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: 'newUser',
                email: 'newUser@gmail.com',
                password: 'newUser',
                confirm_pass: 'newUser',
            };
            yield api
                .post(`${baseAuth}/register`)
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/);
        }));
    });
    describe('POST /api/auth/login', () => {
        test('user login - success', () => __awaiter(void 0, void 0, void 0, function* () {
            const validUser = { email: 'default@gmail.com', password: 'secret' };
            const res = yield api.post(`${baseAuth}/login`).send(validUser);
            token = res.headers['set-cookie'];
            expect(res.headers['set-cookie']).toBeDefined();
        }));
        test('user login - missing email', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                email: '',
                password: 'newUser',
            };
            yield api.post(`${baseAuth}/login`).send(newUser).expect(400);
        }));
        test('user login - wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                email: 'newUser@gmail.com',
                password: 'wrongpass',
            };
            yield api.post(`${baseAuth}/login`).send(newUser).expect(401);
        }));
    });
});
describe('blog routes', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield blog_1.Blog.deleteMany({});
        const blog = new blog_1.Blog({
            title: 'Blog by Default User',
            content: 'Random Content',
            user: userID,
            published: false,
            comments: [],
            tags: [],
        });
        yield blog.save();
        blogID = blog._id.toString();
    }));
    const baseBlog = '/api/blogs';
    describe('GET /api/blogs', () => {
        test('get all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api.get(`${baseBlog}/all`).set('Cookie', [token]).expect(200);
        }));
    });
    describe('POST /api/blogs/blog', () => {
        test('create a blog - success', () => __awaiter(void 0, void 0, void 0, function* () {
            const blog = {
                title: 'A Random Title',
                content: 'Random Content',
            };
            yield api.post(`${baseBlog}/blog`).set('Cookie', [token]).send(blog);
            expect(201);
            const res = yield api.get(`${baseBlog}/all`).set('Cookie', [token]);
            expect(res.body).toHaveLength(2);
        }));
        test('create a blog - missing title or content', () => __awaiter(void 0, void 0, void 0, function* () {
            const blog = {
                content: 'Random Content',
            };
            yield api.post(`${baseBlog}/blog`).set('Cookie', [token]).send(blog);
            expect(422);
        }));
    });
    describe('PUT /api/blogs/blog/:id', () => {
        test('blog update - incomplete input', () => __awaiter(void 0, void 0, void 0, function* () {
            const update = {
                title: 'Updated Title',
            };
            yield api
                .put(`${baseBlog}/blog/${blogID}`)
                .set('Cookie', [token])
                .send(update)
                .expect(422);
        }));
        test('blog update - success', () => __awaiter(void 0, void 0, void 0, function* () {
            const update = {
                title: 'Updated Title',
                content: 'Updated Content',
            };
            yield api
                .put(`${baseBlog}/blog/${blogID}`)
                .set('Cookie', [token])
                .send(update)
                .expect(202);
            const res = yield api.get(`${baseBlog}/all`).set('Cookie', [token]);
            const current = res.body.find((blog) => blog.id === blogID);
            expect(current.title).toEqual('Updated Title');
        }));
    });
    describe('DELETE /api/blogs/:id', () => {
        test('delete blog', () => __awaiter(void 0, void 0, void 0, function* () {
            const blogs = yield api.get(`${baseBlog}/all`).set('Cookie', [token]);
            yield api
                .delete(`${baseBlog}/blog/${blogs.body[1].id}`)
                .set('Cookie', [token])
                .expect(200);
            const res = yield api.get(`${baseBlog}/all`).set('Cookie', [token]);
            expect(res.body).toHaveLength(1);
        }));
    });
});
describe('comment routes', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield comment_1.Comment.deleteMany({});
    }));
    describe('POST /api/comments/:id', () => {
        test('create comment - success', () => __awaiter(void 0, void 0, void 0, function* () {
            const comment = {
                comment_content: 'A new comment',
            };
            yield api
                .post(`/api/comments/${blogID}`)
                .set('Cookie', [token])
                .send(comment)
                .expect(201);
        }));
        test('create comment - missing content', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .post(`/api/comments/${blogID}`)
                .set('Cookie', [token])
                .send()
                .expect(422);
        }));
    });
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
//# sourceMappingURL=api.test.js.map