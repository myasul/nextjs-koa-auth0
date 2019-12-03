const Router = require('koa-router');
const passport = require('koa-passport');
const util = require("util");
const url = require("url");
const querystring = require("querystring");

const router = new Router();


router.get("/login", passport.authenticate('auth0', {
    scope: "openid email profile"
}), (ctx) => ctx.redirect("/"))

router.get('/callback', (ctx, next) => {
    return passport.authenticate('auth0', (err, user, info, status) => {
        const error_codes = ['access_denied', 'unauthorized']
        if (err || error_codes.includes(info)) {
            ctx.redirect('/unauthorized')
        } else if (!user) {
            ctx.redirect('/login')
        } else {
            ctx.logIn(user)
            ctx.redirect('/')
        }
    })(ctx, next)
})

router.get("/logout", (ctx) => {
    ctx.logOut();

    let returnTo = ctx.protocol + "://" + ctx.hostname;
    const port = ctx.URL.port;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
            process.env.NODE_ENV === "production"
                ? `${returnTo}/`
                : `${returnTo}:${port}/`;
    }

    const logoutURL = new url.URL(
        util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
    );
    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    ctx.redirect(logoutURL);
});

module.exports = router;