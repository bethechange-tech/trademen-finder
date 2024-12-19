/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
    // Do whatever you want
    return new Response('Hello World!', {
        status: 200,
    });
}