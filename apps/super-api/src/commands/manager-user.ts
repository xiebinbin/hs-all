import { auth } from "@/lib/auth"
import * as crypto from "crypto";
import chalk from 'chalk';
import inquirer from 'inquirer';

// 显示帮助信息
const showHelp = () => {
    console.log(chalk.cyan('\n📋 用户管理工具'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.white('使用方法:'));
    console.log(chalk.yellow('  bun run manager-user.ts <username> [选项]'));
    console.log(chalk.white('\n选项:'));
    console.log(chalk.green('  --force     ') + chalk.gray('强制更新已存在用户的密码'));
    console.log(chalk.green('  --interactive') + chalk.gray('交互式模式'));
    console.log(chalk.white('\n示例:'));
    console.log(chalk.yellow('  bun run manager-user.ts admin'));
    console.log(chalk.yellow('  bun run manager-user.ts admin --force'));
    console.log(chalk.yellow('  bun run manager-user.ts --interactive'));
    console.log(chalk.gray('━'.repeat(50)));
};

// 显示进度动画
const showProgress = (message: string) => {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${chalk.cyan(frames[i])} ${message}`);
        i = (i + 1) % frames.length;
    }, 100);
    
    return () => {
        clearInterval(interval);
        process.stdout.write('\r');
    };
};

// 交互式模式
const interactiveMode = async () => {
    console.log(chalk.cyan('\n🚀 交互式用户管理'));
    console.log(chalk.gray('━'.repeat(30)));
    
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: '请输入用户名:',
            validate: (input) => {
                if (!input.trim()) {
                    return '用户名不能为空';
                }
                if (input.length < 3) {
                    return '用户名至少需要3个字符';
                }
                if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
                    return '用户名只能包含字母、数字、下划线和连字符';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'phoneNumber',
            message: '请输入手机号 (可选，默认: 13800000000):',
            default: '13800000000',
            validate: (input) => {
                if (input && !/^1[3-9]\d{9}$/.test(input)) {
                    return '请输入有效的手机号';
                }
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'generatePassword',
            message: '是否自动生成密码?',
            default: true
        },
        {
            type: 'password',
            name: 'customPassword',
            message: '请输入自定义密码:',
            when: (answers) => !answers.generatePassword,
            validate: (input) => {
                if (!input || input.length < 6) {
                    return '密码至少需要6个字符';
                }
                return true;
            }
        }
    ]);
    
    return {
        username: answers.username,
        phoneNumber: answers.phoneNumber,
        password: answers.generatePassword ? crypto.randomBytes(16).toString('hex') : answers.customPassword,
        isGenerated: answers.generatePassword
    };
};

const main = async () => {
    try {
        const args = process.argv.slice(2);
        
        // 检查是否为交互式模式
        if (args.includes('--interactive') || args.length === 0) {
            if (args.length === 0) {
                showHelp();
                const { confirm } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: '是否进入交互式模式?',
                        default: true
                    }
                ]);
                if (!confirm) return;
            }
            
            const userInfo = await interactiveMode();
            const stopProgress = showProgress('正在检查用户是否存在...');
            
            const ctx = await auth.$context;
            const oldUser = await ctx.internalAdapter.findUserByEmail(`${userInfo.username}@example.com`);
            stopProgress();
            
            if (oldUser) {
                console.log(chalk.yellow(`⚠️  用户 ${userInfo.username} 已存在`));
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: '请选择操作:',
                        choices: [
                            { name: '更新密码', value: 'update' },
                            { name: '取消操作', value: 'cancel' }
                        ]
                    }
                ]);
                
                if (action === 'cancel') {
                    console.log(chalk.gray('操作已取消'));
                    return;
                }
                
                const updateProgress = showProgress('正在更新密码...');
                const hash = await ctx.password.hash(userInfo.password);
                await ctx.internalAdapter.linkAccount({
                    userId: oldUser.user.id,
                    providerId: "credential",
                    accountId: oldUser.user.id,
                    password: hash,
                });
                updateProgress();
                
                console.log(chalk.green(`✅ 用户 ${userInfo.username} 密码更新成功!`));
                console.log(chalk.cyan(`🔑 ${userInfo.isGenerated ? '新生成的' : '自定义'}密码: `) + chalk.bold(userInfo.password));
            } else {
                const createProgress = showProgress('正在创建用户...');
                const user = await ctx.internalAdapter.createUser({
                    username: userInfo.username,
                    name: userInfo.username,
                    email: `${userInfo.username}@example.com`,
                    emailVerified: true,
                    phoneNumber: userInfo.phoneNumber,
                    phoneNumberVerified: true,
                });
                
                const hash = await ctx.password.hash(userInfo.password);
                await ctx.internalAdapter.linkAccount({
                    userId: user.id,
                    providerId: "credential",
                    accountId: user.id,
                    password: hash,
                });
                createProgress();
                
                console.log(chalk.green(`✅ 用户 ${userInfo.username} 创建成功!`));
                console.log(chalk.cyan(`📧 邮箱: `) + chalk.white(`${userInfo.username}@example.com`));
                console.log(chalk.cyan(`📱 手机: `) + chalk.white(userInfo.phoneNumber));
                console.log(chalk.cyan(`🔑 ${userInfo.isGenerated ? '生成的' : '自定义'}密码: `) + chalk.bold(userInfo.password));
            }
            return;
        }
        
        // 命令行模式
        const username = args[0];
        const forceUpdate = args.includes('--force');
        const password = crypto.randomBytes(16).toString('hex');
        const phoneNumber = '13800000000';
        
        console.log(chalk.cyan(`\n🔍 检查用户: ${username}`));
        const checkProgress = showProgress('正在检查用户状态...');
        
        const ctx = await auth.$context;
        const oldUser = await ctx.internalAdapter.findUserByEmail(`${username}@example.com`);
        checkProgress();
        
        if (oldUser) {
            if (forceUpdate) {
                console.log(chalk.yellow(`⚠️  用户 ${username} 已存在，正在强制更新密码...`));
                const updateProgress = showProgress('正在更新密码...');
                
                const hash = await ctx.password.hash(password);
                await ctx.internalAdapter.linkAccount({
                    userId: oldUser.user.id,
                    providerId: "credential",
                    accountId: oldUser.user.id,
                    password: hash,
                });
                updateProgress();
                
                console.log(chalk.green(`✅ 用户 ${username} 密码更新成功!`));
                console.log(chalk.cyan(`🔑 新密码: `) + chalk.bold(password));
            } else {
                console.log(chalk.yellow(`⚠️  用户 ${username} 已存在`));
                console.log(chalk.gray('💡 如需重置密码，请使用 --force 参数'));
                console.log(chalk.gray('💡 或使用 --interactive 进入交互式模式'));
                return;
            }
        } else {
            console.log(chalk.blue(`🚀 正在创建新用户: ${username}`));
            const createProgress = showProgress('正在创建用户...');
            
            const user = await ctx.internalAdapter.createUser({
                username,
                name: username,
                email: `${username}@example.com`,
                emailVerified: true,
                phoneNumber,
                phoneNumberVerified: true,
            });
            
            const hash = await ctx.password.hash(password);
            await ctx.internalAdapter.linkAccount({
                userId: user.id,
                providerId: "credential",
                accountId: user.id,
                password: hash,
            });
            createProgress();
            
            console.log(chalk.green(`✅ 用户 ${username} 创建成功!`));
            console.log(chalk.cyan(`📧 邮箱: `) + chalk.white(`${username}@example.com`));
            console.log(chalk.cyan(`📱 手机: `) + chalk.white(phoneNumber));
            console.log(chalk.cyan(`🔑 生成的密码: `) + chalk.bold(password));
        }
        
        console.log(chalk.gray('\n━'.repeat(50)));
        console.log(chalk.green('🎉 操作完成!'));
        
    } catch (error) {
        console.log(chalk.red('\n❌ 操作失败:'));
        console.log(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
};

main();