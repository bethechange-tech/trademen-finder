export async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const reader = stream.getReader();

    const chunks: any[] = [];
    let done, value;

    while (!done) {
        ({ done, value } = await reader.read());
        if (value) {

            chunks.push(value as any);
        }
    }
    return Buffer.concat(chunks);
}
