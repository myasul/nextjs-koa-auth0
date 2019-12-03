const Router = require("koa-router")

const router = new Router()

const thoughts = [
    { _id: 123, message: "I love pepperoni pizza", author: "unknown" },
    { _id: 456, message: "I'm watching Netflix", author: "unknown" },
]

function ensureAuthenticated (ctx, next) {
    if (ctx.isAuthenticated()) return next()
    ctx.body = { success: false };
    ctx.throw(401);
}

router.get("/api/thoughts", async (ctx, next) => {
    try {
        const orderedThoughts = thoughts.sort((t1, t2) => t2._id - t1._id)
        ctx.type = "application/json"
        ctx.body = JSON.stringify(orderedThoughts)
    } catch (err) {
        console.log(err)
    }
})

router.post("/api/thoughts", ensureAuthenticated, async (ctx) => {
    const { message } = ctx.body
    const newThought = {
        _id: new Date().getTime(),
        message,
        author: ctx.state.user.displayName
    }
    thoughts.push(newThought)
    try {
        ctx.status = 201
        ctx.body = {
            status: 'success',
            message: "Thank you!"
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router