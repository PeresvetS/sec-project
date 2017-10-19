export default(router) => {
    router
    .get('/404', async (ctx) => {
        ctx.status = 404;
        await ctx.render('error/404');
    })
    .get('/500', async (ctx) => {
        ctx.status = 500;
        await ctx.render('error/500');
    });
};