import { auth } from "@/lib/auth";
import { CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import { RpcContext } from '@/types/jsonrpc';
import { RpcErrors } from '@/rpc/constants/errors';
import { logger } from '@/utils/logger';

/**
 * 认证服务
 * 处理用户登录、注册、验证码发送等认证相关操作
 */
export class AuthService {
  /**
   * 获取当前会话信息
   */
  async getSession(context: RpcContext) {
    if (!context.user) {
      throw RpcErrors.unauthorized('No active session');
    }
    return context.user;
  }
  
  /**
   * 用户登录
   * 支持邮箱和手机号登录
   */
  async login(account: string, password: string) {
    if (!account || !password) {
      throw RpcErrors.invalidParams({ 
        message: 'Account and password are required' 
      });
    }
    
    try {
      const isEmail = account.includes('@');
      
      if (isEmail) {
        // 邮箱登录
        const result = await auth.api.signInEmail({
          body: {
            email: account,
            password: password,
          },
        });
        
        const session = await auth.api.getSession({
          headers: {
            Authorization: `Bearer ${result.token}`,
          } as unknown as Headers,
        });
        
        logger.info(`用户通过邮箱登录成功: ${account}`);
        
        return {
          token: session?.session.token,
          user: session?.user,
        };
      } else {
        const result = await auth.api.signInPhoneNumber({
          body: {
            phoneNumber: account,
            password: password,
            rememberMe: true,
          },
        });
        
        const session = await auth.api.getSession({
          headers: {
            Authorization: `Bearer ${result.token}`,
          } as unknown as Headers,
        });
        
        logger.info(`用户通过手机号登录成功: ${account}`);
        
        return {
          token: session?.session.token,
          user: session?.user,
        };
      }
    } catch (error: any) {
      logger.error(`登录失败: ${account}`, error);
      
      if (error.message?.includes('Invalid OTP') || error.message?.includes('Invalid code')) {
        throw RpcErrors.validationError({ 
          message: 'Invalid verification code' 
        });
      }
      
      throw RpcErrors.internalError(error);
    }
  }
  
  /**
   * 发送手机验证码
   */
  async sendPhoneNumberOTP(phoneNumber: string, country: CountryCode) {
    if (!phoneNumber) {
      throw RpcErrors.invalidParams({ 
        message: 'Phone number is required' 
      });
    }
    try {
      // 验证手机号格式
      const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber, { 
        defaultCountry: country 
      });
      
      if (!parsedPhoneNumber?.isValid()) {
        throw RpcErrors.validationError({ 
          message: 'Invalid phone number format' 
        });
      }
      
      await auth.api.sendPhoneNumberOTP({
        body: {
          phoneNumber: phoneNumber,
        },
      });
      
      logger.info(`验证码已发送到手机: ${phoneNumber}`);
      
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      logger.error(`发送手机验证码失败: ${phoneNumber}`, error);
      
      if (error.name === 'RpcError') {
        throw error;
      }
      
      throw RpcErrors.internalError(error);
    }
  }
  /**
   * 用户登出
   */
  async logout(context: RpcContext) {
    if (!context.session) {
      throw RpcErrors.unauthorized('No active session');
    }
    
    try {
      // TODO: 实现会话清理逻辑
      logger.info(`用户登出: ${context.user?.id}`);
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      logger.error('登出失败:', error);
      throw RpcErrors.internalError(error);
    }
  }
  
  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw RpcErrors.invalidParams({ 
        message: 'Refresh token is required' 
      });
    }
    
    try {
      // TODO: 实现令牌刷新逻辑
      return {
        token: 'new_token',
        refreshToken: 'new_refresh_token',
      };
    } catch (error) {
      logger.error('刷新令牌失败:', error);
      throw RpcErrors.unauthorized('Invalid refresh token');
    }
  }
}

// 导出单例
export const authService = new AuthService();