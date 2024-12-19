"use server";
import { Users } from "@/payload-types";
import { redirect } from "next/navigation";

export const getMe = async (): Promise<Users> => {
  const token = ''
  const meReq = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  const {
    user,
  }: {
    user: Users;
  } = await meReq.json();

  return user;
};

export const getAuthUser = async () => {
  try {
    const user = await getMe()
    return user

  } catch (error) {
    return null;
  }
};


export const getMeUser = async (args?: {
  nullUserRedirect?: string;
  validUserRedirect?: string;
}): Promise<{
  user: Users | null;
  token: string | null;
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {};

  const token = ''

  console.log('Token retrieved:', token);

  if (!token) {
    console.log('No token found.');
    if (nullUserRedirect) {
      console.log('Redirecting to:', nullUserRedirect);
      redirect(nullUserRedirect);
    }

    return { user: null, token: null };
  }

  try {
    console.log('Fetching user with token...');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    console.log('Response status:', response.status);

    if (!response.ok) {
      console.log('Response not OK. Status:', response.status);
      if (nullUserRedirect) {
        console.log('Redirecting to:', nullUserRedirect);
        redirect(nullUserRedirect);
      }
      return { user: null, token };
    }

    const data = await response.json();
    console.log('User data fetched:', data);

    if (validUserRedirect) {
      console.log('Redirecting to:', validUserRedirect);
      redirect(validUserRedirect);
    }

    return {
      user: data.user,
      token,
    };
  } catch (error) {
    console.log('--- BEGIN ERROR LOG ---');
    console.log('Error occurred while fetching user data.');
    console.log('Error details:', error);
    console.log('--- END ERROR LOG ---');
    console.error('Error fetching user:', error);

    if (nullUserRedirect) {
      console.log('Redirecting to:', nullUserRedirect);
      redirect(nullUserRedirect);
    }
    return { user: null, token };
  }
};
