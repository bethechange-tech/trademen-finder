export async function GET(req: Request, context: { params: Promise<{ id: number }> }) {
    const { id } = await context.params;


    return new Response(JSON.stringify(id), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}