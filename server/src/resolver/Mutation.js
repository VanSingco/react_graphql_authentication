import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';
import {waterfall} from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import moment from 'moment';

const Mutation = {
    async loginUser(parent, args, {prisma}, info){
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('User not found!')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)
        
        if(!isMatch){
            throw new Error('Password not match')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async createUser(parent, args, {prisma}, info){

        const emailExist = await prisma.exists.User({email: args.data.email})
        const usernameExist = await prisma.exists.User({username: args.data.username})


        if (emailExist) {
            throw new Error(`Email ${args.data.email} is already taken`)
        }

        if (usernameExist){
            throw new Error(`Username ${args.data.username} is already taken`)
        }

        
        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }

    },


    async deleteUser(parent, args, {prisma, request}, info){
        const userId = getUserId(request)

        const userExists = await prisma.exists.User({id: userId});

        if (!userExists) {
            throw new Error('user not found')
        }
        
        return prisma.mutation.deleteUser({where: {id: userId}}, info)

    
    },

    async updateUser(parent, {data}, {prisma, request}, info){
        const userId = getUserId(request)
        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data,
        }, info)

    },
    async sendPasswordReset(parent, {email}, {prisma}, info){
        const user = await prisma.query.user({where: {email}});

        if (!user) {
            throw new Error(`${email} not found please try again`)
        }

        waterfall([
            (callback) => {
                crypto.randomBytes(20, (err, buff) => {
                    const token = buff.toString('hex');
                    callback(err, token)
                })
            },
            (token, callback) => {

                const current_time = Date.now() + 60*60*1000;
                const tokenExpired = moment(current_time).toISOString();
        
                prisma.mutation.updateUser({
                    where:{email},
                    data: {
                        passwordResetToken: token,
                        passwordResetExpires: tokenExpired
                    }
                }, info)

                callback(null, token, user)
                console.log(user)
            }, 
            (token, user, callback) => {
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'vansingco@gmail.com',
                        pass: '09103607533'
                    }
                });

                let mailOption = {
                    to: email,
                    from: `Singco <dontreply@example.com>`,
                    subject: 'Singco Password reset token',
                    html: `<h2>You have requested for password reset token</h2>
                           <p>Please click the link to complete the process: </p>
                           <a href="http://localhost:3000/reset/${token}">Click here to reset your password</a>`
                }
                smtpTransport.sendMail(mailOption, (err, info) => {
                    callback(err, user)
                })
            } 
        ],(err) => {
            if (err) {
                console.log(err)
            }
            return user
        })
    },
    async passwordReset(parent, {token, password}, {prisma}, info) {
        const current_time = Date.now();
        const tokenExpired = moment(current_time).toISOString();

        const users = await prisma.query.users({
            where:{
                passwordResetToken: token,
                passwordResetExpires_gt: tokenExpired
            }
        })

        if (users.length === 0) {
            throw new Error("The token has been expired please try again")
        }

        const user = users[0]
        const passwordHash = await hashPassword(password);

        return prisma.mutation.updateUser({
            where: {
                id: user.id
            },
            data: {
                password:passwordHash,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        }, info)

    }
}

export {Mutation as default}