'use client';

import { useState, useEffect } from 'react';
import { z, ZodError } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAgreementDialog, PrivacyPolicyDialog } from '../policy-dialog';
import { cn } from "@/lib/utils";

// 手机号验证schema
const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号格式');

// 验证码验证schema
const otpSchema = z.string().length(6, '验证码必须为6位数字').regex(/^\d{6}$/, '验证码只能包含数字');

export function LoginForm() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [otpError, setOtpError] = useState('');

    // 倒计时逻辑
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // 验证手机号格式
    const validatePhone = (phone: string) => {
        try {
            phoneSchema.parse(phone);
            setPhoneError('');
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                setPhoneError(error.issues[0].message);
            }
            return false;
        }
    };

    // 验证验证码格式
    const validateOtp = (otp: string) => {
        try {
            otpSchema.parse(otp);
            setOtpError('');
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                setOtpError(error.issues[0].message);
            }
            return false;
        }
    };

    // 获取验证码
    const handleGetCode = async () => {
        if (!validatePhone(phone)) {
            return;
        }

        if (!agreedToTerms) {
            alert('请先同意用户协议和隐私政策');
            return;
        }

        setIsLoading(true);
        try {
            // 这里应该调用实际的API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            setStep('otp');
            setCountdown(60);
        } catch (error) {
            console.error('获取验证码失败:', error);
            alert('获取验证码失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 重新获取验证码
    const handleResendCode = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        try {
            // 这里应该调用实际的API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            setCountdown(60);
        } catch (error) {
            console.error('重新获取验证码失败:', error);
            alert('重新获取验证码失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 修改手机号
    const handleChangePhone = () => {
        setStep('phone');
        setOtp('');
        setCountdown(0);
    };

    // 验证登录
    const handleLogin = async () => {
        if (!validateOtp(otp)) {
            return;
        }

        setIsLoading(true);
        try {
            // 这里应该调用实际的登录API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            alert('登录成功');
        } catch (error) {
            console.error('登录失败:', error);
            alert('验证码错误，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm bg-white p-4">
                {/* 头部 */}
                <div className="text-center mb-8">
                    <img src="/vercel.svg" alt="三林康德卫生服务中心" className="w-16 h-16 mx-auto mb-2 bg-black rounded-full" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">三林康德卫生服务中心</h1>
                </div>

                {/* 手机号输入步骤 */}
                {step === 'phone' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                手机号
                            </label>
                            <Input
                                type="tel"
                                placeholder="请输入手机号"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={cn("h-12 text-lg", phoneError && "border-red-500")}
                                maxLength={11}
                            />
                            {phoneError && (
                                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                            )}
                        </div>

                        {/* 协议同意 */}
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="terms"
                                checked={agreedToTerms}
                                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                                className="mt-1"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                我已阅读并同意
                                <UserAgreementDialog>
                                    <button type="button" className="text-blue-600 hover:underline mx-1">《用户协议》</button>
                                </UserAgreementDialog>
                                和
                                <PrivacyPolicyDialog>
                                    <button type="button" className="text-blue-600 hover:underline mx-1">《隐私政策》</button>
                                </PrivacyPolicyDialog>
                            </label>
                        </div>

                        <Button
                            onClick={handleGetCode}
                            disabled={!phone || !agreedToTerms || isLoading}
                            className="w-full h-12 text-lg rounded-xl"
                        >
                            {isLoading ? '获取中...' : '获取验证码'}
                        </Button>
                    </div>
                )}

                {/* 验证码输入步骤 */}
                {step === 'otp' && (
                    <div className="space-y-6">
                        {/* 手机号显示和修改 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    验证码已发送至: <span className="font-medium">{phone}</span>
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleChangePhone}
                                    disabled={countdown > 0}
                                    className={cn(
                                        "text-blue-600 hover:text-blue-700",
                                        countdown > 0 && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    修改
                                </Button>
                            </div>
                        </div>

                        {/* OTP输入 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                验证码
                            </label>
                            <div className="flex justify-between">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    containerClassName='w-full'
                                >
                                    <InputOTPGroup className='w-full flex justify-between'>
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={0} />
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={1} />
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={2} />
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={3} />
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={4} />
                                        <InputOTPSlot className='border border-gray-300 rounded-md' index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            {otpError && (
                                <p className="text-red-500 text-sm text-center mt-2">{otpError}</p>
                            )}
                        </div>

                        {/* 重新获取验证码 */}
                        <div className="text-center">
                            <Button
                                variant="ghost"
                                onClick={handleResendCode}
                                disabled={countdown > 0 || isLoading}
                                className={`text-sm ${countdown > 0 ? 'text-gray-500' : 'text-blue-600'}`}
                            >
                                {countdown > 0 ? `${countdown}s后重新获取` : '重新获取验证码'}
                            </Button>
                        </div>

                        {/* 登录按钮 */}
                        <Button
                            onClick={handleLogin}
                            disabled={otp.length !== 6 || isLoading}
                            className="w-full h-12 text-lg rounded-xl"
                        >
                            {isLoading ? '登录中...' : '登录'}
                        </Button>
                    </div>
                )}


            </div>
        </div>
    );
}