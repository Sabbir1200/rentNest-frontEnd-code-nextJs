"use server"

import { jwtUtils } from "@/app/utils/jwt";
import { cookies } from "next/headers";


export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh Token not found",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Authorization: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
      
    }
  );

  const result = await res.json();

  console.log(result);

  return result;
};

export const isAccessTokenExits = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
   
    if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: "User not Logged In",
    };
  }

  const decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
  
 const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;
  

  if(!decodedAccessToken?.success && decodedRefreshToken?.success){
         //access token has expired but refresh token is valid, get new access token from backend
         const result = await getNewAccessToken();
 
         if(result.success){
             const newAccessToken = result.data.accessToken;
 
             cookieStore.set("accessToken", newAccessToken , {
                 httpOnly : true,
                 maxAge : 60 * 60 * 24,
                 sameSite : "lax",
             });
 
             accessToken = newAccessToken;
             
 
 
         }
     }
     return accessToken ;
    }   