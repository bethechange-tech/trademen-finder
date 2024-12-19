import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import HttpStatus from "./http/http-status.enum";
import { User, UserProfile } from "@prisma/client";


type StringKeyedObject = { [key: string]: any };

interface JwtPayload extends jwt.JwtPayload {
  id: string;
}

/**
 * Utility class providing methods for common controller operations.
 */
export class ControllerUtils {
  constructor() { }

  /**
   * Checks if a user's password was changed after a given JWT timestamp.
   * @param {number} JWTTimestamp - The timestamp from the JWT.
   * @param {any} user - The user object.
   * @returns {boolean} True if the password was changed after the JWT was issued, false otherwise.
   */

  public changedPasswordAfter = (JWTTimestamp: number, user: any): boolean => {
    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );

      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  };

  /**
   * Promisified version of jwt.verify for verifying JWT tokens asynchronously.
   * @param token The JWT token to verify.
   * @param secret The secret key used for verifying the token.
   * @param options Optional verification options.
   * @returns The decoded JWT payload.
   */
  public jwtVerify = (
    token: string,
    secret: jwt.Secret,
    options?: jwt.VerifyOptions
  ): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, options, (err, decodedToken) => {
        if (err) {
          return reject(err);
        }

        resolve(decodedToken as JwtPayload);
      });
    });
  };

  /**
   * Signs a JWT token with the given user ID.
   * @param {string | number} id - The user ID.
   * @returns {string} The signed JWT token.
   */
  protected signToken = (id: string | number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  /**
   * Hashes a password using bcrypt.
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} The hashed password.
   */
  public hashPassword = (password: string) => {
    return bcrypt.hash(password, 12);
  };

  /**
   * Creates a token, sets it as a cookie, and sends the response.
   * @param {{
   *   user: User,
   *   req: Request,
   *   token?: string
   * }} - The user object, the request object, and an optional token.
   * @returns The response with the token and user data.
   */
  public createSendToken = async ({
    user,
    req,
    token = this.signToken(user?.id || ''),
    statusCode = HttpStatus.OK,
    cookieName = 'jwt'
  }: {
    user?: User & UserProfile;
    req: Request;
    token?: string;
    statusCode?: number;
    cookieName: string;
  }) => {
    const cookieSet = await cookies()

    cookieSet.set(cookieName, token, {
      expires: new Date(
        Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.headers.get("x-forwarded-proto") === "https",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return Response.json(
      {
        status: "success",
        token,
        data: {
          user,
        },
      },
      {
        status: statusCode,
      }
    );
  };

  /**
   * Compares a candidate password with a user's hashed password.
   * @param {string} candidatePassword - The password to compare.
   * @param {string} userPassword - The hashed password.
   * @returns {Promise<boolean>} True if the passwords match, false otherwise.
   */
  public correctPassword = async function (
    candidatePassword: string,
    userPassword: string
  ) {
    return bcrypt.compare(candidatePassword, userPassword);
  };

  /**
   * Checks if two passwords match.
   * @param {string} password - The first password.
   * @param {string} passwordConfirm - The second password to compare.
   * @returns {boolean} True if the passwords match, false otherwise.
   */
  public matchPasswords = (
    password: string,
    passwordConfirm: string
  ): boolean => {
    return password === passwordConfirm;
  };

  /**
   * Filters an object based on allowed fields.
   * @param {StringKeyedObject} obj - The object to filter.
   * @param {...string[]} allowedFields - The fields to allow in the resulting object.
   * @returns {StringKeyedObject} The filtered object.
   */
  public filterObj = (
    obj: StringKeyedObject,
    ...allowedFields: string[]
  ): StringKeyedObject => {
    const newObj: StringKeyedObject = {};

    Object.keys(obj).forEach((el: string) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    if (newObj.password) delete newObj.password;

    return newObj;
  };
}
