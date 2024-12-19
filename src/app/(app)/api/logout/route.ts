import { HandlerFunctionWrapper } from "@/lib/handler-wrapper";
import HttpStatus from "@/lib/http/http-status.enum";
import { cookies } from "next/headers";

export const GET = HandlerFunctionWrapper(async () => {
  (await cookies()).set("payload-token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return Response.json(
    { successful: true },
    {
      status: HttpStatus.NO_CONTENT,
    }
  );
});
