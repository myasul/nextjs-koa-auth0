require("dotenv").config()

const Koa = require('koa');
const http = require("http")
const next = require("next")
const session = require("koa-session")
const Router = require("koa-router")
const bodyParser = require("koa-bodyparser")

// 1- Import dependencies
const passport = require("koa-passport")
const Auth0Strategy = require("passport-auth0")
const uid = require("uid-safe")
const authRoutes = require("./auth-routes")
const thoughtsAPI = require("./thoughts-api")

const dev = process.env.NODE_ENV !== "production"
const app = next({
    dev,
    dir: "./src"
})
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = ['your-session-secret'];
    const CONFIG = {
        key: 'koa:sess',
        maxAge: 86400000,
    }

    server.use(session(CONFIG, server))
    server.use(bodyParser())

    // 3 - configuring Auth0Strategy
    const auth0Strategy = new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
        function (accessToken, refreshToken, extraParams, profile, done) {
            console.log("INSIDE AUTH STRATEGY CALL")
            console.log(profile)
            return done(null, profile)
        })

    // 4 - configuring Passport
    passport.use(auth0Strategy)
    server.use(passport.initialize())
    server.use(passport.session())

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    // 5 - adding Passport and authentication routes

    mainRouter = new Router()

    mainRouter.use(
        thoughtsAPI.routes(),
        thoughtsAPI.allowedMethods(),
        authRoutes.routes(),
        authRoutes.allowedMethods(),
    )

    function ensureAuthenticated (ctx, next) {
        if (ctx.isAuthenticated()) return next()
        ctx.redirect("/login")
    }

    mainRouter.get("/share-thought", ensureAuthenticated, async (ctx, next) => {
        await app.render(ctx.req, ctx.res, "/share-thought", ctx.query)
        ctx.respond = false
    })

    mainRouter.get("/profile", ensureAuthenticated, async (ctx, next) => {
        await app.render(ctx.req, ctx.res, "/profile", ctx.query)
        ctx.respond = false
    })

    mainRouter.get("/unauthorized", async (ctx, next) => {
        const err = new Error('Unauthorized')
        ctx.req.status = 401
        ctx.req.statusCode = 401
        ctx.res.status = 401
        ctx.res.statusCode = 401
        queryParams = Object.assign({ status: 401, statusCode: 401, err: err })
        await app.render(ctx.req, ctx.res, '/_error', queryParams)
        ctx.respond = false
    })

    mainRouter.get("*", async (ctx, next) => {
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.use(mainRouter.routes())
    server.use(mainRouter.allowedMethods())

    server.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`)
    })
})