export default(router) => {
    router.get('root', '/', async (ctx) => {
        await ctx.render('welcome');
    })
    .post('root-post', '/', async (ctx) => {
        const form = ctx.request;
        console.log(ctx);
        console.log(ctx.request.body.form);
    });
};
