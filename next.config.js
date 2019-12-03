require("dotenv").config()

const path = require("path")
const Dotenv = require("dotenv-webpack")
const webpack = require('webpack')

module.exports = {
    webpack: config => {
        config.plugins = config.plugins || []

        config.devtool = 'eval-source-map';

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, ".env"),
                systemvars: true
            })
        ]

        return config
    }
}

