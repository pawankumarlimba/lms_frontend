import { HttpClient } from "@/lib/api/HttpClient";
import { IAuthResult, IUser } from "@/types/user";

export interface ISignupPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

class AuthApi extends HttpClient {
  constructor() {
    super();
  }

  public signup(payload: ISignupPayload): Promise<IAuthResult> {
    return this.post<IAuthResult>("/auth/signup", payload);
  }

  public login(payload: ILoginPayload): Promise<IAuthResult> {
    return this.post<IAuthResult>("/auth/login", payload);
  }

  public logout(): Promise<null> {
    return this.post<null>("/auth/logout");
  }

  public me(): Promise<IUser> {
    return this.get<IUser>("/auth/me");
  }
}

export const authApi = new AuthApi();
