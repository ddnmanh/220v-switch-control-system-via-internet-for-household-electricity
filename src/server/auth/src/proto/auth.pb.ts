// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.29.2
// source: auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "./google/protobuf/struct.pb";

export const protobufPackage = "auth";

/** Common */
export interface FieldError {
  property: string;
  message: string;
}

export interface CommonRes {
  code: number;
  status: string;
  message: FieldError[];
  data: { [key: string]: any } | undefined;
}

/** Register */
export interface RegisterReq {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
}

export interface ResendOTPVerifyRegisterAccountReq {
  idRegister: number;
  email: string;
}

/** Verify OTP when register account */
export interface OTPVerifyRegisterAccountReq {
  email: string;
  otp: string;
}

/** Log in */
export interface LogInReq {
  username: string;
  password: string;
  latitude: number;
  longitude: number;
}

export interface LogOutReq {
  refreshToken: string;
}

/** Validate token */
export interface ValidateTokenReq {
  token: string;
  type: string;
}

/** Get user info */
export interface GetUserInfoReq {
  token: string;
  type: string;
}

/** Renew access token */
export interface RenewAccessTokenReq {
  token: string;
  type: string;
}

export const AUTH_PACKAGE_NAME = "auth";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface AuthServiceClient {
  register(request: RegisterReq): Observable<CommonRes>;

  resendOtpVerifyRegisterAccount(request: ResendOTPVerifyRegisterAccountReq): Observable<CommonRes>;

  otpVerifyRegisterAccount(request: OTPVerifyRegisterAccountReq): Observable<CommonRes>;

  logIn(request: LogInReq): Observable<CommonRes>;

  logOut(request: LogOutReq): Observable<CommonRes>;

  validateToken(request: ValidateTokenReq): Observable<CommonRes>;

  getUserInfo(request: GetUserInfoReq): Observable<CommonRes>;

  renewAccessToken(request: RenewAccessTokenReq): Observable<CommonRes>;
}

export interface AuthServiceController {
  register(request: RegisterReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  resendOtpVerifyRegisterAccount(
    request: ResendOTPVerifyRegisterAccountReq,
  ): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  otpVerifyRegisterAccount(
    request: OTPVerifyRegisterAccountReq,
  ): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  logIn(request: LogInReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  logOut(request: LogOutReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  validateToken(request: ValidateTokenReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  getUserInfo(request: GetUserInfoReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;

  renewAccessToken(request: RenewAccessTokenReq): Promise<CommonRes> | Observable<CommonRes> | CommonRes;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "register",
      "resendOtpVerifyRegisterAccount",
      "otpVerifyRegisterAccount",
      "logIn",
      "logOut",
      "validateToken",
      "getUserInfo",
      "renewAccessToken",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
