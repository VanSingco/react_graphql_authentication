import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword'

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

    }
}

export {Mutation as default}