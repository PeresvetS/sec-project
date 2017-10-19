import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default() => ({
    entry: {
        app: ['./client/app.js'],
        vendor: [
            'babel-polyfill',
            'jquery',
            'animate.css',
            'bootstrap-loader',
            './client/js/checker',
            './client/js/custom',
            './client/js/wow',
        ],
    },
    output: {
        path: path.join(__dirname, 'public', 'assets'),
        filename: 'app.js',
        publicPath: '/assets/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            'flow',
                            'stage-0',
                            'env',
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                exclude: /node_modules/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 400000,
                        },
                    },
                    'image-webpack-loader',
                ],
            },
            {
                test: /bootstrap[/\\]dist[/\\]js[/\\]umd[/\\]/,
                use: 'imports-loader?jQuery=jquery',
            },
            // {
            //     test: /jquery-mousewheel/,
            //     use: 'imports-loader?define=>false&this=>window',
            // },
            // {
            //     test: /malihu-custom-scrollbar-plugin/,
            //     use: 'imports-loader?define=>false&this=>window',
            // }
        ],
    },
    plugins: [
        new ExtractTextPlugin('./app.css'),
        new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
        Tether: 'tether',
        'window.Tether': 'tether',
        Popper: ['popper.js', 'default'],
        Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
        Button: 'exports-loader?Button!bootstrap/js/dist/button',
        Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
        Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
        Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
        Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
        Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
        Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
        Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
        Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
        Util: 'exports-loader?Util!bootstrap/js/dist/util',
    }),
    new webpack
        .optimize
        .CommonsChunkPlugin({
            // This name 'vendor' ties into the entry definition
            name: 'vendor',
            // We don't want the default vendor.js name
            filename: 'vendor.js',
            // Passing Infinity just creates the commons chunk, but moves no modules into
            // it. In other words, we only put what's in the vendor entry definition in
            // vendor-bundle.js
            minChunks: Infinity,
        }),
    ],
    resolve: {
        modules: ['node_modules', path.join(__dirname, 'client')],
        extensions: ['.js', '.jsx'],
  },
});
