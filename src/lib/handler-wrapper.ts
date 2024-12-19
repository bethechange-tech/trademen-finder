import errorFunction from "./error/errorController";
import { NextRequest } from "next/server";
import AppError from "./appError";
import { getHankoSession } from "@/helpers/hanko-helpers";

type NextHandlerFunction = (
  req: NextRequest,
  res: any,
  user?: {
    email: string;
    authProviderId: string;
    exp: number;
  } | null
) => Promise<Response>;

const HandlerFunctionWrapper = (
  handlerFunction: NextHandlerFunction,
  options?: { useAuth?: boolean }
) => {
  return async (req: NextRequest, res: any) => {
    let loggedInUser: {
      email: string;
      authProviderId: string;
      exp: number;
    } | null = null;

    try {
      if (options?.useAuth) {
        const hankoTokenKey = 'hanko-token';
        const hankoToken = await
          req.headers?.get(hankoTokenKey)
          || await req.cookies?.get(hankoTokenKey)
          || await req.headers?.get('hanko')
          || await req.cookies?.get('hanko');

        const session = await getHankoSession(hankoToken?.toString());

        if (!session) {
          throw new AppError(
            "Failed to retrieve user data. Please ensure you are logged in and have the correct permissions.",
            401
          );
        }

        console.log("User data retrieved:", session.authProviderId);

        loggedInUser = session;
      }

      return await handlerFunction(req, res, loggedInUser);
    } catch (e: any) {
      return errorFunction(e, req, res);
    }
  };
};

export { HandlerFunctionWrapper };
