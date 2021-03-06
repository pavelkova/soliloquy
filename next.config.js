module.exports = {
  future: {
    webpack5: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'webpack-graphql-loader'
        }
      ]
    })
    return config
  }
}
